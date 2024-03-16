import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Category from "@/models/category";
import { ZodError, z } from "zod";

interface UpdateCategoryRequest {
  name: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const id = params.id;
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
      })
      .parse(body);

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { ...parsedBody } },
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

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category id is required" },
        {
          status: 400,
        }
      );
    }

    await Category.findOneAndDelete({ _id: id });

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
