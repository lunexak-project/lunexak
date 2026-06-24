const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
    },
    position: {
      type: String,
      default: "home-hero",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: "Featured Collection",
    },
    sub: {
      type: String,
      default: "Explore our latest curated collections.",
    },
    cta: {
      type: String,
      default: "Shop Now",
    },
    secondary: {
      type: String,
      default: "View All",
    },
    secondaryLink: {
      type: String,
      default: "/products",
    },
    bg: {
      type: String,
      default: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
