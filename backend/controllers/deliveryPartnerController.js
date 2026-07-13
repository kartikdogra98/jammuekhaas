const User = require("../models/User");
const DeliveryPartner = require("../models/DeliveryPartner");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// ==============================
// Admin - Create Delivery Partner
// POST /api/delivery-partners
// ==============================
const createPartner = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    vehicleType,
    vehicleNumber,
  } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "delivery",
    isEmailVerified: true,
  });

  const partner = await DeliveryPartner.create({
    user: user._id,
    vehicleType,
    vehicleNumber,
    isAvailable: true,
    isApproved: true,
  });

  res.status(201).json({
    success: true,
    user,
    partner,
  });
});

// ==============================
// Admin - Get All Delivery Partners
// GET /api/delivery-partners
// ==============================
const getPartners = asyncHandler(async (req, res) => {
  const partners = await DeliveryPartner.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    partners,
  });
});

// ==============================
// Admin - Update Delivery Partner
// PUT /api/delivery-partners/:id
// ==============================
const updatePartner = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findById(req.params.id);

  if (!partner) {
    throw new ApiError(404, "Delivery Partner not found");
  }

  const user = await User.findById(partner.user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  await user.save();

  partner.vehicleType =
    req.body.vehicleType || partner.vehicleType;

  partner.vehicleNumber =
    req.body.vehicleNumber || partner.vehicleNumber;

  if (req.body.isAvailable !== undefined) {
    partner.isAvailable = req.body.isAvailable;
  }

  if (req.body.isApproved !== undefined) {
    partner.isApproved = req.body.isApproved;
  }

  await partner.save();

  const updated = await DeliveryPartner.findById(partner._id)
    .populate("user", "name email phone");

  res.status(200).json({
    success: true,
    partner: updated,
  });
});

// ==============================
// Admin - Delete Delivery Partner
// DELETE /api/delivery-partners/:id
// ==============================
const deletePartner = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findById(req.params.id);

  if (!partner) {
    throw new ApiError(404, "Delivery Partner not found");
  }

  await User.findByIdAndDelete(partner.user);

  await partner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Delivery Partner Deleted",
  });
});

// ==============================
// Delivery - Create Own Profile
// POST /api/delivery/profile
// ==============================
const createProfile = asyncHandler(async (req, res) => {
  const existing = await DeliveryPartner.findOne({
    user: req.user._id,
  });

  if (existing) {
    throw new ApiError(
      409,
      "Delivery partner profile already exists"
    );
  }

  const profile = await DeliveryPartner.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    profile,
  });
});

// ==============================
// Delivery - Get Own Profile
// ==============================
const getProfile = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({
    user: req.user._id,
  }).populate("user", "name email phone");

  if (!profile) {
    throw new ApiError(
      404,
      "Delivery partner profile not found"
    );
  }

  res.status(200).json({
    success: true,
    profile,
  });
});

// ==============================
// Delivery - Update Own Profile
// ==============================
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true }
  ).populate("user", "name email phone");

  if (!profile) {
    throw new ApiError(
      404,
      "Delivery partner profile not found"
    );
  }

  res.status(200).json({
    success: true,
    profile,
  });
});

// ==============================
// Delivery - Assigned Orders
// ==============================
const getAssignedOrders = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({
    user: req.user._id,
  });

  if (!profile) {
    throw new ApiError(
      404,
      "Delivery partner profile not found"
    );
  }

  const orders = await Order.find({
    deliveryPartner: profile._id,
  })
    .populate("restaurant", "name address")
    .populate("user", "name phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ==============================
// Delivery - Available Orders
// ==============================
const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    status: "preparing",
    deliveryPartner: null,
  })
    .populate("restaurant", "name address")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ==============================
// Delivery - Accept Order
// ==============================
const acceptOrder = asyncHandler(async (req, res) => {
  const profile = await DeliveryPartner.findOne({
    user: req.user._id,
  });

  if (!profile) {
    throw new ApiError(
      404,
      "Delivery partner profile not found"
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.deliveryPartner) {
    throw new ApiError(
      409,
      "Order already assigned"
    );
  }

  order.deliveryPartner = profile._id;
  order.status = "out_for_delivery";

  order.statusHistory.push({
    status: "out_for_delivery",
    at: new Date(),
  });

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

module.exports = {
  createPartner,
  getPartners,
  updatePartner,
  deletePartner,
  createProfile,
  getProfile,
  updateProfile,
  getAssignedOrders,
  getAvailableOrders,
  acceptOrder,
};