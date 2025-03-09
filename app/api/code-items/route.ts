import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import CodeItem, { CodeItemDocument } from "@/models/code-item";
import { ZodError, z } from "zod";
import User from "@/models/user";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs";
import Category from "@/models/category";

interface NewCodeItemRequest {
  name: string;
  category_id: string;
  description?: string;
  code?: string;
  label_ids?: string[];
}

export async function GET(req: NextRequest) {
  await connectDb();

  const session = await getServerSession({ ...authConfig });

  const { searchParams } = new URL(req.url);
  const userId = session?.user?.id;

  const categoryId = searchParams.get("categoryId");
  const searchQuery = searchParams.get("q");
  const labels = searchParams.getAll("label");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
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

  const category = await Category.findOne({
    _id: new mongoose.Types.ObjectId(categoryId),
    user_id: new mongoose.Types.ObjectId(userId),
  });

  const pageTitle = category.name || "Code items";

  try {
    const aggregationPipeline: any[] = [
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
          label_ids: 1,
        },
      },
    ];

    if (searchQuery) {
      aggregationPipeline.push({
        $match: {
          name: { $regex: searchQuery, $options: "i" },
        },
      });
    }

    if (labels.length > 0) {
      const labelObjectIds = labels.map(
        (label) => new mongoose.Types.ObjectId(label)
      );

      aggregationPipeline.push({
        $match: {
          label_ids: { $in: labelObjectIds },
        },
      });
    }

    const countPipeline = [...aggregationPipeline, { $count: "total" }];

    aggregationPipeline.push({ $skip: skip }, { $limit: limit });

    const [totalResult] = await CodeItem.aggregate(countPipeline);
    const totalItems = totalResult?.total || 0;

    const codeItems = await CodeItem.aggregate(aggregationPipeline);

    const populatedCodeItems = await CodeItem.populate(codeItems, {
      path: "label_ids",
      select: "id name color text_color",
      options: { skipInvalidIds: true },
    });

    const responseItems = populatedCodeItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      labels: item.label_ids
        ? item.label_ids.map((label: any) => ({
            id: label._id,
            name: label.name,
            color: label.color,
            text_color: label.text_color,
          }))
        : [],
    }));

    const hasMore = skip + responseItems.length < totalItems;

    return NextResponse.json({
      success: true,
      data: responseItems,
      pageTitle,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasMore,
      },
    });
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

    const session = await getServerSession({ ...authConfig });
    const userId = session?.user?.id;
    const body = (await req.json()) as NewCodeItemRequest;

    const parsedBody = z
      .object({
        name: z.string().min(1),
        category_id: z.string().min(1),
        description: z.string().optional(),
        language: z.string().min(1),
        code: z.string(),
        label_ids: z.array(z.string()).optional(),
      })
      .parse(body);

    const user = await User.findById(userId);

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
      user_id: userId,
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

export const runtime = "edge";
