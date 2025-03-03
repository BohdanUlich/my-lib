import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import Label, { LabelDocument } from "@/models/label";
import { ZodError, z } from "zod";
import User from "@/models/user";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "@/configs";

interface NewLabelRequest {
  name: string;
  color: string;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectDb();
  const session = await getServerSession({ ...authConfig });
  const { searchParams } = new URL(req.url);
  const labelType = searchParams.get("type");
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      {
        status: 400,
      }
    );
  }

  if (!labelType) {
    return NextResponse.json(
      { success: false, error: "Label type is required" },
      {
        status: 400,
      }
    );
  }

  try {
    const labels = await Label.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          type: labelType,
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          _id: 0,
          name: 1,
          color: 1,
          type: 1,
          text_color: 1,
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
    const session = await getServerSession({ ...authConfig });
    const userId = session?.user?.id;

    const body = (await req.json()) as NewLabelRequest;

    const parsedBody = z
      .object({
        name: z.string().min(1),
        color: z.string(),
        type: z.string().min(1),
        text_color: z.string().min(1),
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

    const existingLabel = await Label.findOne({
      name: parsedBody.name,
      user_id: userId,
      type: parsedBody.type,
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

    const label = (await Label.create({
      ...parsedBody,
      user_id: userId,
    })) as LabelDocument;

    return NextResponse.json({
      success: true,
      data: {
        label: {
          id: label._id.toString(),
          name: label.name,
          color: label.color,
          text_color: label.text_color,
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
