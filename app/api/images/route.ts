import { NextRequest, NextResponse } from "next/server";
import { Image, IMAGES_API_ENDPOINT } from "@/types";
import { deleteFile, uploadFile } from "@/lib/s3";
import { mapUrlsToKeys } from "@/helpers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll(IMAGES_API_ENDPOINT) as File[];

    const uploadPromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const fileName = `${Date.now()}-${file.name}`;
      const mimeType = file.type;

      await uploadFile({
        file: Buffer.from(buffer),
        fileName,
        mimeType,
      });

      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${fileName}`;

      return {
        url,
        name: file.name,
      };
    });

    const uploadedImages: Image[] = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, data: uploadedImages });
  } catch (error) {
    console.error("Upload images error:", error);
    return NextResponse.json({ success: false, error: "Image upload failed" });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { urls } = await req.json();

    // Extract and decode the keys from the URLs
    const keys = mapUrlsToKeys(urls);

    await Promise.all(keys.map((key) => deleteFile({ key })));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image deletion error:", error);
    return NextResponse.json({
      success: false,
      error: "Image deletion failed",
    });
  }
}
