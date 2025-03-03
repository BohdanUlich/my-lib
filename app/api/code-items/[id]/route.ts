import { NextRequest, NextResponse } from "next/server";
import { connectDb, deleteFile } from "@/lib";
import { ZodError, z } from "zod";
import CodeItem from "@/models/code-item";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs";
import { extractImageUrls, mapUrlsToKeys } from "@/helpers";

interface UpdateCodeItemRequest {
  name: string;
  description?: string;
  code?: string;
  label_ids?: string[];
}

const codeItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  code: z.string().optional(),
  language: z.string().min(1),
  label_ids: z.array(z.string()).optional(),
});

export const dynamic = "force-dynamic";

type CodeItemSchema = z.infer<typeof codeItemSchema>;

const internalServerError = NextResponse.json(
  {
    success: false,
    error: "Internal server error",
  },
  { status: 500 }
);

const validateBody = async (body: unknown): Promise<CodeItemSchema> => {
  return codeItemSchema.parse(body);
};

const updateCodeItem = async (id: string, parsedBody: CodeItemSchema) => {
  const codeItem = await CodeItem.findOneAndUpdate(
    { _id: id },
    { $set: { ...parsedBody } },
    { new: true }
  );

  if (!codeItem) {
    return internalServerError;
  }

  return codeItem;
};

const deleteCodeItem = async (labelId: string): Promise<void> => {
  await CodeItem.findOneAndDelete({ _id: labelId });
};

const deleteImagesFromS3 = async (codeItemId: string) => {
  const codeItem = await CodeItem.findById(codeItemId);

  // Extract image URLs from the content
  const imageUrls = extractImageUrls(codeItem?.description || "");

  if (imageUrls.length > 0) {
    // Map URLs to keys for S3 deletion
    const keys = mapUrlsToKeys(imageUrls);

    // Delete all images from S3
    await Promise.all(keys.map((key) => deleteFile({ key })));
  }
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const id = (await params).id;
    const body = (await req.json()) as UpdateCodeItemRequest;

    const parsedBody = await validateBody(body);
    const codeItem = await updateCodeItem(id, parsedBody);

    return NextResponse.json({ success: true, data: codeItem });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors.map((err) => ({
            message: err.message,
            source: err.path?.[0],
          })),
        },
        { status: 422 }
      );
    }

    return internalServerError;
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const codeItemId = (await params).id;

    await deleteImagesFromS3(codeItemId);

    await deleteCodeItem(codeItemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return internalServerError;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const session = await getServerSession({ ...authConfig });
    const userId = session?.user?.id;
    const codeItemId = (await params).id;

    const codeItem = await CodeItem.findById(codeItemId);

    if (!codeItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Code item not found",
        },
        { status: 404 }
      );
    }

    if (codeItem.user_id.toString() !== userId?.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { _id, ...rest } = codeItem.toObject();
    const responseData = { id: _id.toString(), ...rest };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    return internalServerError;
  }
}
