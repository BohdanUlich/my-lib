import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import { ZodError, z } from "zod";
import Label from "@/models/label";
import Category from "@/models/category";
import CodeItem from "@/models/code-item";
import { CATEGORY_TYPE, CODE_ITEM_TYPE } from "@/types";

interface UpdateLabelRequest {
  name: string;
  color: string;
}

const labelSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  type: z.string().min(1),
  text_color: z.string().min(1),
});

type LabelSchema = z.infer<typeof labelSchema>;

const validateBody = async (body: unknown): Promise<LabelSchema> => {
  return labelSchema.parse(body);
};

const updateLabel = async (id: string, parsedBody: LabelSchema) => {
  const label = await Label.findOneAndUpdate(
    { _id: id },
    { $set: { ...parsedBody } },
    { new: true }
  );

  if (!label) {
    throw new Error("Label not found");
  }

  if (label.type === CATEGORY_TYPE) {
    // Update label in all categories
    await Category.updateMany(
      { "labels._id": id },
      { $set: { "labels.$": label } }
    );
  }

  if (label.type === CODE_ITEM_TYPE) {
    // Update label in all code items
    await CodeItem.updateMany(
      { "labels.id": id },
      { $set: { "labels.$": { label, id: label._id } } }
    );
  }

  return label;
};

const deleteLabel = async (labelId: string): Promise<void> => {
  await Label.findOneAndDelete({ _id: labelId });
  await Category.updateMany(
    { "labels._id": labelId },
    { $pull: { labels: { _id: labelId } } }
  );
  await CodeItem.updateMany(
    { "labels.id": labelId },
    { $pull: { labels: { _id: labelId } } }
  );
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const id = (await params).id;
    const body = (await req.json()) as UpdateLabelRequest;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Label id is required" },
        {
          status: 400,
        }
      );
    }

    const parsedBody = await validateBody(body);
    const label = await updateLabel(id, parsedBody);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const labelId = (await params).id;

    if (!labelId) {
      return NextResponse.json(
        { success: false, error: "Label id is required" },
        {
          status: 400,
        }
      );
    }

    await deleteLabel(labelId);

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

export const runtime = "edge";
