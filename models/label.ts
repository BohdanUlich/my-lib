import { CATEGORY_TYPE, CODE_ITEM_TYPE } from "@/types";
import mongoose, { Schema, models } from "mongoose";

enum LabelType {
  CATEGORY = CATEGORY_TYPE,
  CODE_ITEM = CODE_ITEM_TYPE,
}

export interface LabelDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  category_ids?: mongoose.Schema.Types.ObjectId[];
  user_id: mongoose.Schema.Types.ObjectId;
  type: LabelType;
  color: string;
}

const labelSchema = new Schema<LabelDocument>(
  {
    name: { type: String, required: true, unique: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: [LabelType.CATEGORY, LabelType.CODE_ITEM],
      required: true,
    },
    category_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    ],
    color: { type: String },
  },
  { timestamps: true }
);

const Label = models.Label || mongoose.model("Label", labelSchema);

export default Label;
