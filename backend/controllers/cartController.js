const Cart = require('../models/Cart');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc Get current user's cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.food').populate('restaurant', 'name deliveryFee minOrderAmount');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.status(200).json({ success: true, cart });
});

// @desc Add item to cart
// @route POST /api/cart/items
const addItem = asyncHandler(async (req, res) => {
  const { foodId, quantity = 1 } = req.body;
  const food = await Food.findById(foodId);
  if (!food || !food.isAvailable) throw new ApiError(404, 'Food item not available');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, restaurant: food.restaurant, items: [] });
  }

  // Enforce single-restaurant cart (Swiggy/Zomato style)
  if (cart.items.length > 0 && cart.restaurant && cart.restaurant.toString() !== food.restaurant.toString()) {
    throw new ApiError(
      409,
      'Your cart contains items from another restaurant. Clear cart to add items from this restaurant.'
    );
  }
  cart.restaurant = food.restaurant;

  const existingItem = cart.items.find((item) => item.food.toString() === foodId);
  const effectivePrice = food.discountPrice > 0 ? food.discountPrice : food.price;

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ food: foodId, quantity: Number(quantity), price: effectivePrice });
  }

  await cart.save();
  await cart.populate('items.food');

  res.status(200).json({ success: true, cart });
});

// @desc Update item quantity
// @route PUT /api/cart/items/:foodId
const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.food.toString() === req.params.foodId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.food.toString() !== req.params.foodId);
  } else {
    item.quantity = quantity;
  }

  if (cart.items.length === 0) cart.restaurant = null;

  await cart.save();
  await cart.populate('items.food');

  res.status(200).json({ success: true, cart });
});

// @desc Remove item from cart
// @route DELETE /api/cart/items/:foodId
const removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.food.toString() !== req.params.foodId);
  if (cart.items.length === 0) cart.restaurant = null;

  await cart.save();
  await cart.populate('items.food');

  res.status(200).json({ success: true, cart });
});

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], restaurant: null, coupon: null });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
