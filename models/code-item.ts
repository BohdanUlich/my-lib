import mongoose, { Schema, models } from "mongoose";

export interface CodeItemDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description?: string;
  code?: string;
  category_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  language: string;
  labels: {
    label_id: mongoose.Schema.Types.ObjectId;
    name: string;
    color: string;
  }[];
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
    labels: {
      type: [
        {
          label_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Label",
            required: true,
          },
          name: { type: String, required: true },
          color: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const CodeItem = models.CodeItem || mongoose.model("CodeItem", codeItemSchema);

export default CodeItem;
