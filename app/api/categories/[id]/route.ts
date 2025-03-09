import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Category from "@/models/category";
import { ZodError, z } from "zod";
import { MongoError } from "@/types";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs";
import CodeItem from "@/models/code-item";

interface UpdateCategoryRequest {
  name: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const id = (await params).id;
    const body = (await req.json()) as UpdateCategoryRequest;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category id is required" },
        {
          status: 400,
        }
      );
    }

    const parsedBody = z
      .object({
        name: z.string().min(1),
        labels: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
            text_color: z.string(),
          })
        ),
      })
      .parse(body);

    const updatedLabels = parsedBody.labels.map(({ id, ...rest }) => ({
      _id: id,
      ...rest,
    }));

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { name: parsedBody.name, labels: updatedLabels } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: category });
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

    const mongoError = error as MongoError;

    if (mongoError.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "A category with this name already exists",
        },
        { status: 400 }
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

    const session = await getServerSession({ ...authConfig });
    const userId = session?.user?.id;
    const categoryId = (await params).id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "Category id is required" },
        {
          status: 400,
        }
      );
    }

    await CodeItem.deleteMany({ user_id: userId, category_id: categoryId });

    await Category.findOneAndDelete({ _id: categoryId });

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
