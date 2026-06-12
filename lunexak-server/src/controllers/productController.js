const Product = require("../models/Product");
const mongoose = require("mongoose");

const isValidProductId = (id) =>
  typeof id === "string" &&
  mongoose.Types.ObjectId.isValid(id);

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.user) {
      productData.createdBy = req.user._id;
    }
    
    // Always start as draft if not explicitly set by admin
    if (!productData.status || req.user?.role === "employee") {
      productData.status = "DRAFT";
    }

    const product = await Product.create(productData);

    if (product.status === "DRAFT") {
      const User = require("../models/User");
      const Notification = require("../models/Notification");
      const admins = await User.find({ role: "admin" });
      
      const notifications = admins.map(admin => ({
        user: admin._id,
        message: `Employee saved a new product "${product.title}" as draft.`,
        type: "INFO",
        actionUrl: "/admin/products"
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { status, category, subCategory, isTrending, search, limit, sort, createdBy } = req.query;
    
    // Build query
    let query = {};
    if (status) query.status = status;
    if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (subCategory) query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    if (isTrending === 'true') query.isTrending = true;
    if (createdBy) query.createdBy = createdBy;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let mongooseQuery = Product.find(query);

    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // Pagination/Limit
    if (limit) {
      mongooseQuery = mongooseQuery.limit(parseInt(limit, 10));
    }

    const products = await mongooseQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }



    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SUBMIT PRODUCT (Employee)
const submitProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const product = await Product.findByIdAndUpdate(req.params.id, { status: "PENDING" }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Not Found" });

    // Notify all admins
    const User = require("../models/User");
    const Notification = require("../models/Notification");
    
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map(admin => ({
      user: admin._id,
      message: `A new product "${product.title}" was submitted for review.`,
      type: "INFO",
      actionUrl: "/admin/approvals"
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({ success: true, message: "Product submitted for review", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// APPROVE PRODUCT (Admin)
const approveProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const product = await Product.findByIdAndUpdate(req.params.id, { status: "APPROVED", adminComment: "" }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Not Found" });
    
    const Approval = require("../models/Approval");
    await Approval.create({ productId: product._id, adminId: req.user._id, action: "APPROVED" });
    
    if (product.createdBy) {
      const Notification = require("../models/Notification");
      await Notification.create({
        user: product.createdBy,
        message: `Your product "${product.title}" has been approved.`,
        type: "SUCCESS",
        actionUrl: `/product/${product._id}`
      });
    }
    
    res.status(200).json({ success: true, message: "Product approved", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REJECT PRODUCT (Admin)
const rejectProduct = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!isValidProductId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const product = await Product.findByIdAndUpdate(req.params.id, { status: "REJECTED", adminComment: comment }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Not Found" });
    
    const Approval = require("../models/Approval");
    await Approval.create({ productId: product._id, adminId: req.user._id, action: "REJECTED", comment });
    
    if (product.createdBy) {
      const Notification = require("../models/Notification");
      await Notification.create({
        user: product.createdBy,
        message: `Your product "${product.title}" was rejected. Reason: ${comment || 'No comment provided.'}`,
        type: "ERROR"
      });
    }
    
    res.status(200).json({ success: true, message: "Product rejected", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLISH PRODUCT (Admin)
const publishProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not Found" });
    if (product.status !== "APPROVED") return res.status(400).json({ success: false, message: "Product must be approved first" });
    
    product.status = "LIVE";
    await product.save();
    
    const Approval = require("../models/Approval");
    await Approval.create({ productId: product._id, adminId: req.user._id, action: "PUBLISHED" });
    
    res.status(200).json({ success: true, message: "Product published", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  submitProduct,
  approveProduct,
  rejectProduct,
  publishProduct,
};
