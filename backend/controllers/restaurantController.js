const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc Get all restaurants (with search, filter, pagination)
// @route GET /api/restaurants
const getRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, city, sort, page = 1, limit = 12 } = req.query;
  const query = { isApproved: true };

  if (search) query.$text = { $search: search };
  if (cuisine) query.cuisine = { $in: cuisine.split(',') };
  if (city) query['address.city'] = new RegExp(city, 'i');

  let sortOption = { createdAt: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'delivery_time') sortOption = { avgDeliveryTime: 1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [restaurants, total] = await Promise.all([
    Restaurant.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
    Restaurant.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: restaurants.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    restaurants,
  });
});

// @desc Get single restaurant with its menu
// @route GET /api/restaurants/:id
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  const menu = await Food.find({ restaurant: restaurant._id, isAvailable: true }).populate('category', 'name');

  res.status(200).json({ success: true, restaurant, menu });
});

// @desc Create restaurant (restaurant owner)
// @route POST /api/restaurants
const createRestaurant = asyncHandler(async (req, res) => {
  const data = { ...req.body, owner: req.user._id };

  // When sent as multipart/form-data (because an image file is attached),
  // nested objects/arrays arrive as JSON strings — parse them back.
  if (typeof data.address === 'string') {
    try {
      data.address = JSON.parse(data.address);
    } catch (e) {
      data.address = { street: data.address };
    }
  }
  if (typeof data.cuisine === 'string') {
    try {
      data.cuisine = JSON.parse(data.cuisine);
    } catch (e) {
      data.cuisine = data.cuisine.split(',').map((c) => c.trim()).filter(Boolean);
    }
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/restaurants');
    data.image = { url: result.secure_url, public_id: result.public_id };
  }

  const restaurant = await Restaurant.create(data);
  res.status(201).json({ success: true, restaurant });
});

// @desc Update restaurant
// @route PUT /api/restaurants/:id
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this restaurant');
  }

  if (typeof req.body.address === 'string') {
    try {
      req.body.address = JSON.parse(req.body.address);
    } catch (e) {
      req.body.address = { street: req.body.address };
    }
  }
  if (typeof req.body.cuisine === 'string') {
    try {
      req.body.cuisine = JSON.parse(req.body.cuisine);
    } catch (e) {
      req.body.cuisine = req.body.cuisine.split(',').map((c) => c.trim()).filter(Boolean);
    }
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/restaurants');
    req.body.image = { url: result.secure_url, public_id: result.public_id };
  }

  Object.assign(restaurant, req.body);
  await restaurant.save();

  res.status(200).json({ success: true, restaurant });
});

// @desc Delete restaurant
// @route DELETE /api/restaurants/:id
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');

  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this restaurant');
  }

  await restaurant.deleteOne();
  await Food.deleteMany({ restaurant: restaurant._id });

  res.status(200).json({ success: true, message: 'Restaurant deleted' });
});

// @desc Get restaurants owned by logged in user
// @route GET /api/restaurants/my/list
const getMyRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user._id });
  res.status(200).json({ success: true, restaurants });
});

// @desc Toggle open/closed status
// @route PATCH /api/restaurants/:id/toggle-status
const toggleOpenStatus = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();
  res.status(200).json({ success: true, restaurant });
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
  toggleOpenStatus,
};
