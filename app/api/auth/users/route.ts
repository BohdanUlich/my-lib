import { connectDb } from "@/lib";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}

interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>;

export const POST = async (req: NextRequest): Promise<NewResponse> => {
  try {
    const body = (await req.json()) as NewUserRequest;

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
      .parse(body);

    await connectDb();

    const oldUser = await User.findOne({ email: parsedCredentials.email });

    if (oldUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already in use",
        },
        { status: 422 }
      );
    }

    const user = await User.create({ ...parsedCredentials });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
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
};
