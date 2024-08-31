import { connectDb } from "@/lib";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, email, password } = await req.json();

  await connectDb();
  await User.create({ name, email, password });

  return NextResponse.json({ message: "User registered" }, { status: 200 });
};
