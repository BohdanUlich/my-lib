import mongoose, { Schema, models } from "mongoose";

interface CategoryDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  user_id: mongoose.Schema.Types.ObjectId;
  labels: {
    label_id: mongoose.Schema.Types.ObjectId;
    name: string;
    color: string;
    text_color: string;
  }[];
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
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
          text_color: { type: String, required: true },
        },
      ],
      default: [],
    },
  },

  { timestamps: true }
);

categorySchema.index({ name: 1, user_id: 1 }, { unique: true });

const Category = models.Category || mongoose.model("Category", categorySchema);

export default Category;
