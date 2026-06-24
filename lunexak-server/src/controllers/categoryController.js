const Category = require("../models/Category");

// Helper function to build category tree
const buildTree = (categories, parentId = null) => {
  const categoryList = [];
  let currentLevelCategories;
  
  if (parentId == null) {
    currentLevelCategories = categories.filter(cat => cat.parentId == null);
  } else {
    currentLevelCategories = categories.filter(cat => String(cat.parentId) === String(parentId));
  }
  
  for (let cat of currentLevelCategories) {
    categoryList.push({
      ...cat.toObject(),
      children: buildTree(categories, cat._id)
    });
  }
  
  return categoryList.sort((a, b) => a.displayOrder - b.displayOrder);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, slug, parentId, isActive, isFeatured, displayOrder, bannerImage, seoTitle, seoDescription } = req.body;

    // Check if category with slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category with this slug already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      parentId: parentId || null,
      isActive,
      isFeatured,
      displayOrder,
      bannerImage,
      seoTitle,
      seoDescription,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories (as tree)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1 });
    const categoryTree = buildTree(categories);
    
    res.status(200).json({ success: true, categories: categoryTree, flatCategories: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('parentId', 'name slug');
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, slug, parentId, isActive, isFeatured, displayOrder, bannerImage, seoTitle, seoDescription } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: "Category with this slug already exists" });
      }
    }

    // Prevent a category from being its own parent
    if (parentId && String(parentId) === String(category._id)) {
      return res.status(400).json({ success: false, message: "A category cannot be its own parent" });
    }

    category.name = name || category.name;
    category.slug = slug || category.slug;
    if (parentId !== undefined) category.parentId = parentId;
    if (isActive !== undefined) category.isActive = isActive;
    if (isFeatured !== undefined) category.isFeatured = isFeatured;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (bannerImage !== undefined) category.bannerImage = bannerImage;
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;

    const updatedCategory = await category.save();

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Optional: check if category has children before deleting
    const children = await Category.countDocuments({ parentId: category._id });
    if (children > 0) {
       return res.status(400).json({ success: false, message: "Cannot delete category with sub-categories. Please delete them first or reassign them." });
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: "Category removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category status
// @route   PATCH /api/categories/:id/status
// @access  Private/Admin
const updateCategoryStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category featured status
// @route   PATCH /api/categories/:id/featured
// @access  Private/Admin
const updateCategoryFeatured = async (req, res) => {
  try {
    const { isFeatured } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  updateCategoryFeatured
};
