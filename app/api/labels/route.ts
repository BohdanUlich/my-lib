import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Label, { LabelDocument } from "@/models/label";
import { ZodError, z } from "zod";
import User from "@/models/user";
import mongoose from "mongoose";

interface NewLabelRequest {
  name: string;
  user_id: string;
  color: string;
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
    const labels = await Label.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          id: { $toString: "$_id" },
          _id: 0,
          name: 1,
          color: 1,
          category_ids: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, data: labels });
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

    const body = (await req.json()) as NewLabelRequest;

    const parsedBody = z
      .object({
        name: z.string().min(1),
        user_id: z.string(),
        color: z.string(),
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

    const existingLabel = await Label.findOne({
      name: parsedBody.name,
      user_id: parsedBody.user_id,
    });

    if (existingLabel) {
      return NextResponse.json(
        {
          success: false,
          error: "Label with this name already exists",
        },
        { status: 422 }
      );
    }

    const label = (await Label.create({ ...parsedBody })) as LabelDocument;

    return NextResponse.json({
      success: true,
      data: {
        label: {
          id: label._id.toString(),
          name: label.name,
          color: label.color,
        },
      },
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
