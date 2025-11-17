const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR",
        required: true,
        trim: true,
      },
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ createdBy: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: "text", description: "text" });

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
