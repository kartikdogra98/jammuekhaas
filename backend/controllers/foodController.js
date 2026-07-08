const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc Get foods with search/filter
// @route GET /api/foods
const getFoods = asyncHandler(async (req, res) => {
  const { search, category, restaurant, isVeg, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  const query = { isAvailable: true };

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (restaurant) query.restaurant = restaurant;
  if (isVeg) query.isVeg = isVeg === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [foods, total] = await Promise.all([
    Food.find(query).populate('restaurant', 'name rating').populate('category', 'name').skip(skip).limit(Number(limit)),
    Food.countDocuments(query),
  ]);

  res.status(200).json({ success: true, count: foods.length, total, foods });
});

// @desc Get single food
// @route GET /api/foods/:id
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant').populate('category', 'name');
  if (!food) throw new ApiError(404, 'Food item not found');
  res.status(200).json({ success: true, food });
});

// @desc Create food item
// @route POST /api/foods
const createFood = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to add food to this restaurant');
  }

  const data = { ...req.body };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/foods');
    data.image = { url: result.secure_url, public_id: result.public_id };
  }

  const food = await Food.create(data);
  res.status(201).json({ success: true, food });
});

// @desc Update food item
// @route PUT /api/foods/:id
const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant');
  if (!food) throw new ApiError(404, 'Food item not found');

  if (food.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this food item');
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/foods');
    req.body.image = { url: result.secure_url, public_id: result.public_id };
  }

  Object.assign(food, req.body);
  await food.save();

  res.status(200).json({ success: true, food });
});

// @desc Delete food item
// @route DELETE /api/foods/:id
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant');
  if (!food) throw new ApiError(404, 'Food item not found');

  if (food.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this food item');
  }

  await food.deleteOne();
  res.status(200).json({ success: true, message: 'Food item deleted' });
});

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
