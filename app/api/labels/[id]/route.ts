import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import { ZodError, z } from "zod";
import Label from "@/models/label";
import Category from "@/models/category";

interface UpdateLabelRequest {
  name: string;
  color: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const id = params.id;
    const body = (await req.json()) as UpdateLabelRequest;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Label id is required" },
        {
          status: 400,
        }
      );
    }

    const parsedBody = z
      .object({
        name: z.string().min(1),
        color: z.string().min(1),
        category_ids: z.array(z.string()),
      })
      .parse(body);

    console.log("parsedBody", parsedBody);

    const label = await Label.findOneAndUpdate(
      { _id: id },
      { $set: { ...parsedBody } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: label });
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

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const labelId = params.id;

    if (!labelId) {
      return NextResponse.json(
        { success: false, error: "Label id is required" },
        {
          status: 400,
        }
      );
    }

    await Label.findOneAndDelete({ _id: labelId });

    await Category.updateMany(
      { "labels._id": labelId },
      { $pull: { labels: { _id: labelId } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
