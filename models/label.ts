import { CATEGORY_TYPE, CODE_ITEM_TYPE, LIGHT_TEXT, DARK_TEXT } from "@/types";
import mongoose, { Schema, models } from "mongoose";

type LabelType = typeof CATEGORY_TYPE | typeof CODE_ITEM_TYPE;
type LabelTextColor = typeof LIGHT_TEXT | typeof DARK_TEXT;

export interface LabelDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  category_ids?: mongoose.Schema.Types.ObjectId[];
  user_id: mongoose.Schema.Types.ObjectId;
  type: LabelType;
  color: string;
  text_color: LabelTextColor;
}

const labelSchema = new Schema<LabelDocument>(
  {
    name: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: [CATEGORY_TYPE, CODE_ITEM_TYPE],
      required: true,
    },
    category_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    ],
    color: { type: String },
    text_color: {
      type: String,
      enum: [DARK_TEXT, LIGHT_TEXT],
      required: true,
    },
  },
  { timestamps: true }
);

const Label = models.Label || mongoose.model("Label", labelSchema);

export default Label;
