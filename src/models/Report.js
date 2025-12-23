import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    enum: [
      "Copyright infringement",
      "Inappropriate content",
      "Scam/Fraud",
      "Broken file",
      "False description",
      "Other",
    ],
    required: true,
  },
  details: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
});

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;