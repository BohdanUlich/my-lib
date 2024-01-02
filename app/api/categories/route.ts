import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q");

  return NextResponse.json({ message: "categories" });
};

export const POST = async (req: Request) => {
  const body = await req.json();

  return NextResponse.json(body);
};
