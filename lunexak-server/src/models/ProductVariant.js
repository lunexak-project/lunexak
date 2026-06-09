const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["SIZE", "COLOR", "MATERIAL", "PACKAGING"],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    priceModifier: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
