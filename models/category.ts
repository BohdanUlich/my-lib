import mongoose, { Schema, models } from "mongoose";

interface CategoryDocument {}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = models.Category || mongoose.model("Category", categorySchema);

export default Category;
