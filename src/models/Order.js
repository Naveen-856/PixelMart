import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pricePaid: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: signed download URL with expiry
  downloadUrl: String,
  downloadExpiresAt: Date,
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;