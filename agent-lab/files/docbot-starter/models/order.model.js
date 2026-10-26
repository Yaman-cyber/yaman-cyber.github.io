const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },   // e.g. ORD-10023
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["processing", "shipped", "delivered", "cancelled", "refunded"], default: "processing" },
    total: { type: Number, required: true },                   // AED
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
