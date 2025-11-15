const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    storeAddress: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    storeDescription: {
      type: String,
      trim: true,
    },
    storeLogo: {
      type: String,
      trim: true,
    },
    sellerGst: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/,
        "Format Not Proper",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("seller", sellerSchema);

module.exports = Seller;
