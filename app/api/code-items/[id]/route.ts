import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib";
import { ZodError, z } from "zod";
import CodeItem from "@/models/code-item";

interface UpdateCodeItemRequest {
  name: string;
  description?: string;
  code?: string;
}

const codeItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  code: z.string().optional(),
});

type CodeItemSchema = z.infer<typeof codeItemSchema>;

const internalServerError = NextResponse.json(
  {
    success: false,
    error: "Internal server error",
  },
  { status: 500 }
);

const validateBody = async (body: unknown): Promise<CodeItemSchema> => {
  return codeItemSchema.parse(body);
};

const updateCodeItem = async (id: string, parsedBody: CodeItemSchema) => {
  const codeItem = await CodeItem.findOneAndUpdate(
    { _id: id },
    { $set: { ...parsedBody } },
    { new: true }
  );

  if (!codeItem) {
    return internalServerError;
  }

  return codeItem;
};

const deleteCodeItem = async (labelId: string): Promise<void> => {
  await CodeItem.findOneAndDelete({ _id: labelId });
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const id = params.id;
    const body = (await req.json()) as UpdateCodeItemRequest;

    const parsedBody = await validateBody(body);
    const codeItem = await updateCodeItem(id, parsedBody);

    return NextResponse.json({ success: true, data: codeItem });
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

    return internalServerError;
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const codeItemId = params.id;

    await deleteCodeItem(codeItemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return internalServerError;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const codeItemId = params.id;

    const codeItem = await CodeItem.findById(codeItemId);

    if (!codeItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Code item not found",
        },
        { status: 404 }
      );
    }

    if (codeItem.user_id.toString() !== userId?.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { _id, ...rest } = codeItem.toObject();
    const responseData = { id: _id.toString(), ...rest };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    return internalServerError;
  }
}
