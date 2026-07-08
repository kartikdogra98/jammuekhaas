const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc Register/create delivery partner profile
// @route POST /api/delivery/profile
const createProfile = asyncHandler(async (req, res) => {
  const existing = await DeliveryPartner.findOne({ user: req.user._id });
  if (existing) throw new ApiError(409, 'Delivery partner profile already exists');

  const profile = await DeliveryPartner.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, profile });
});

// @desc Get own delivery partner profile
// @route GET /api/delivery/profile
const getProfile = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Delivery partner profile not found');
  res.status(200).json({ success: true, profile });
});

// @desc Update availability / location
// @route PUT /api/delivery/profile
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true }
  );
  if (!profile) throw new ApiError(404, 'Delivery partner profile not found');
  res.status(200).json({ success: true, profile });
});

// @desc Get orders assigned to this delivery partner
// @route GET /api/delivery/orders
const getAssignedOrders = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Delivery partner profile not found');

  const orders = await Order.find({ deliveryPartner: profile._id })
    .populate('restaurant', 'name address')
    .populate('user', 'name phone')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, orders });
});

// @desc Get orders available for pickup (out_for_delivery candidates, unassigned)
// @route GET /api/delivery/available-orders
const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: 'preparing', deliveryPartner: null })
    .populate('restaurant', 'name address')
    .sort({ createdAt: 1 });
  res.status(200).json({ success: true, orders });
});

// @desc Accept an order for delivery
// @route PATCH /api/delivery/orders/:id/accept
const acceptOrder = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Delivery partner profile not found');

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.deliveryPartner) throw new ApiError(409, 'Order already assigned to another partner');

  order.deliveryPartner = profile._id;
  order.status = 'out_for_delivery';
  order.statusHistory.push({ status: 'out_for_delivery', at: new Date() });
  await order.save();

  res.status(200).json({ success: true, order });
});

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getAssignedOrders,
  getAvailableOrders,
  acceptOrder,
};
