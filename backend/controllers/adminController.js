const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc Get dashboard analytics (admin)
// @route GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalRestaurants, totalOrders, totalFoods] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Order.countDocuments(),
    Food.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // Last 7 days revenue trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const revenueTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const topRestaurants = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: '$restaurant', revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'restaurants', localField: '_id', foreignField: '_id', as: 'restaurant' } },
    { $unwind: '$restaurant' },
    { $project: { name: '$restaurant.name', revenue: 1, orders: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: { totalUsers, totalRestaurants, totalOrders, totalFoods, totalRevenue },
    revenueTrend,
    ordersByStatus,
    topRestaurants,
  });
});

// @desc Get all users (admin)
// @route GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);
  res.status(200).json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc Update user (activate/deactivate/change role) (admin)
// @route PUT /api/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const allowedFields = ['role', 'isActive'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// @desc Delete user (admin)
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, message: 'User deleted' });
});

// @desc Get restaurants pending approval (admin)
// @route GET /api/admin/restaurants/pending
const getPendingRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isApproved: false })
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, restaurants });
});

// @desc Approve a restaurant (admin)
// @route PATCH /api/admin/restaurants/:id/approve
const approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, restaurant });
});

// @desc Reject (delete) a pending restaurant (admin)
// @route DELETE /api/admin/restaurants/:id/reject
const rejectRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, message: 'Restaurant rejected and removed' });
});

// @desc Get all orders (admin)
// @route GET /api/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = {};
  if (status) query.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);
  res.status(200).json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

module.exports = {
  getAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getAllOrders,
};
