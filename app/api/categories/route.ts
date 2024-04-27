import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Category from "@/models/category";
import { ZodError, z } from "zod";
import User from "@/models/user";
import mongoose from "mongoose";

interface NewCategoryRequest {
  name: string;
  user_id: string;
}

interface MongoError {
  code?: number;
  message: string;
}

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const searchQuery = searchParams.get("q");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User id is required" },
      {
        status: 400,
      }
    );
  }

  try {
    let aggregationPipeline: any[] = [
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          id: { $toString: "$_id" },
          _id: 0,
          name: 1,
          user_id: 1,
          labels: {
            $map: {
              input: "$labels",
              as: "label",
              in: {
                id: { $toString: "$$label._id" },
                name: "$$label.name",
                color: "$$label.color",
              },
            },
          },
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

    const categories = await Category.aggregate(aggregationPipeline);

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
