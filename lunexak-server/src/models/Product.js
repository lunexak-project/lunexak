const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: { type: String, default: "Uncategorized" },
    subCategory: { type: String, default: "" },
    brand: { type: String },

    // Variants
    sizes: [{ type: String }],       // e.g. ["S","M","L","XL"]
    colors: [
      {
        name: { type: String },        // Red
        hex: { type: String },         // #FF0000
      }
    ],

    // Images
    images: [
      {
        url: { type: String },
        alt: { type: String },
      },
    ],

    stock: { type: Number, default: 0 },

    // Workflow
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "APPROVED", "REJECTED", "LIVE"],
      default: "DRAFT",
    },
    adminComment: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // SEO
    seoTitle: { type: String },
    seoDescription: { type: String },
    tags: [{ type: String }],
    
    isTrending: { type: Boolean, default: false },

    // Reviews
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);