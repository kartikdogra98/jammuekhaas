const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc Get all categories
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.status(200).json({ success: true, categories });
});

// @desc Create category (admin)
// @route POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/categories');
    data.image = { url: result.secure_url, public_id: result.public_id };
  }
  const category = await Category.create(data);
  res.status(201).json({ success: true, category });
});

// @desc Update category (admin)
// @route PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/categories');
    req.body.image = { url: result.secure_url, public_id: result.public_id };
  }

  Object.assign(category, req.body);
  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc Delete category (admin)
// @route DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
