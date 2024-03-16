import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Category from "@/models/category";
import { ZodError, z } from "zod";
import User from "@/models/user";

interface NewCategoryRequest {
  name: string;
  user_id: string;
}

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User id is required" },
      {
        status: 400,
      }
    );
  }

  try {
    const categories = (
      await Category.find({ user_id: userId }).sort({ createdAt: -1 })
    ).map((category) => {
      const { _id, ...categoryData } = category.toObject();
      return { id: _id.toString(), ...categoryData };
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = (await req.json()) as NewCategoryRequest;

    const parsedBody = z
      .object({
        name: z.string().min(1),
        user_id: z.string(),
      })
      .parse(body);

    const user = await User.findById(body.user_id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User doesn't exist",
        },
        { status: 422 }
      );
    }

    const category = await Category.create({ ...parsedBody });

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category._id.toString(),
          name: category.name,
        },
      },
    });
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
