import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import CodeItem, { CodeItemDocument } from "@/models/code-item";
import { ZodError, z } from "zod";
import User from "@/models/user";
import mongoose from "mongoose";

interface NewCodeItemRequest {
  name: string;
  user_id: string;
  category_id: string;
  description?: string;
  code?: string;
}

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const categoryId = searchParams.get("categoryId");
  const searchQuery = searchParams.get("q");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User id is required" },
      {
        status: 400,
      }
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

  try {
    let aggregationPipeline: any[] = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          category_id: new mongoose.Types.ObjectId(categoryId),
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          _id: 0,
          name: 1,
          description: 1,
        },
      },
    ];

    if (searchQuery) {
      aggregationPipeline.unshift({
        $match: {
          name: { $regex: searchQuery, $options: "i" },
        },
      });
    }

    const codeItems = await CodeItem.aggregate(aggregationPipeline);

    return NextResponse.json({ success: true, data: codeItems });
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

    const body = (await req.json()) as NewCodeItemRequest;

    const parsedBody = z
      .object({
        name: z.string().min(1),
        user_id: z.string().min(1),
        category_id: z.string().min(1),
        description: z.string(),
        language: z.string().min(1),
        code: z.string(),
      })
      .parse(body);

    const user = await User.findById(parsedBody.user_id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User doesn't exist",
        },
        { status: 422 }
      );
    }

    (await CodeItem.create({
      ...parsedBody,
    })) as CodeItemDocument;

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
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
