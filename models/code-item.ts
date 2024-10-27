import mongoose, { Schema, models } from "mongoose";

export interface CodeItemDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description?: string;
  code?: string;
  category_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  language: string;
  label_ids: mongoose.Schema.Types.ObjectId[];
}

const codeItemSchema = new Schema<CodeItemDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    language: { type: String },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    label_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Label",
      default: [],
    },
  },
  { timestamps: true }
);

const CodeItem = models.CodeItem || mongoose.model("CodeItem", codeItemSchema);

export default CodeItem;
