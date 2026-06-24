const mongoose = require("mongoose");

const seoPageSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      required: true,
      enum: ["HOME", "CATEGORY", "PRODUCT", "CUSTOM"],
      default: "CUSTOM",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
    },
    canonicalUrl: {
      type: String,
    },
    schemaJson: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SeoPage", seoPageSchema);
