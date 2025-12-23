import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Ebooks",
      "Courses",
      "Templates",
      "Resume / Portfolio / Cover Letter",
      "UI Kits",
      "Wallpaper",
      "Music",
      "Projects",
      "Other",
    ],
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;