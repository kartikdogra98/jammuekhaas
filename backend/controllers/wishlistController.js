const Wishlist = require('../models/Wishlist');
const asyncHandler = require('../utils/asyncHandler');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, foods: [], restaurants: [] });
  return wishlist;
};

// @desc Get wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('foods')
    .populate('restaurants');
  res.status(200).json({ success: true, wishlist: wishlist || { foods: [], restaurants: [] } });
});

// @desc Toggle a food item in wishlist
// @route POST /api/wishlist/food/:foodId
const toggleFood = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const idx = wishlist.foods.findIndex((f) => f.toString() === req.params.foodId);
  if (idx > -1) wishlist.foods.splice(idx, 1);
  else wishlist.foods.push(req.params.foodId);
  await wishlist.save();
  res.status(200).json({ success: true, wishlist });
});

// @desc Toggle a restaurant in wishlist
// @route POST /api/wishlist/restaurant/:restaurantId
const toggleRestaurant = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const idx = wishlist.restaurants.findIndex((r) => r.toString() === req.params.restaurantId);
  if (idx > -1) wishlist.restaurants.splice(idx, 1);
  else wishlist.restaurants.push(req.params.restaurantId);
  await wishlist.save();
  res.status(200).json({ success: true, wishlist });
});

module.exports = { getWishlist, toggleFood, toggleRestaurant };
