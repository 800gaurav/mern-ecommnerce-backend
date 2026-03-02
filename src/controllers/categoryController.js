const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({
    success: true,
    data: categories,
  });
});

// Create category (Admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(409);
    throw new Error("Category already exists");
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const category = await Category.create({ name, slug });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// Update category (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (name && name !== category.name) {
    category.name = name;
    category.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  if (typeof isActive !== "undefined") category.isActive = isActive;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

// Delete category (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
