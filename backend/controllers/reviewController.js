const Review = require('../models/Review');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const recalcRating = async (Model, id, field) => {
  const filter = field === 'restaurant' ? { restaurant: id } : { food: id };
  const reviews = await Review.find(filter);
  const numReviews = reviews.length;
  const rating = numReviews ? reviews.reduce((s, r) => s + r.rating, 0) / numReviews : 0;
  await Model.findByIdAndUpdate(id, { rating: Math.round(rating * 10) / 10, numReviews });
};

// @desc Create review for a food item or restaurant tied to a delivered order
// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { order: orderId, food, restaurant, rating, comment } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorized');
  if (order.status !== 'delivered') throw new ApiError(400, 'You can only review delivered orders');

  const review = await Review.create({
    user: req.user._id,
    order: orderId,
    food: food || undefined,
    restaurant: restaurant || order.restaurant,
    rating,
    comment,
  });

  if (food) await recalcRating(Food, food, 'food');
  await recalcRating(Restaurant, review.restaurant, 'restaurant');

  res.status(201).json({ success: true, review });
});

// @desc Get reviews for a restaurant or food
// @route GET /api/reviews?restaurant=&food=
const getReviews = asyncHandler(async (req, res) => {
  const { restaurant, food } = req.query;
  const query = {};
  if (restaurant) query.restaurant = restaurant;
  if (food) query.food = food;

  const reviews = await Review.find(query).populate('user', 'name avatar').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc Delete a review (own review or admin)
// @route DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  await review.deleteOne();
  if (review.food) await recalcRating(Food, review.food, 'food');
  if (review.restaurant) await recalcRating(Restaurant, review.restaurant, 'restaurant');

  res.status(200).json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getReviews, deleteReview };
