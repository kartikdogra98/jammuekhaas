const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const generateOrderNumber = () =>
  'JEK' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 900 + 100);

const computeOrderTotals = async (cart) => {
  const restaurant = await Restaurant.findById(cart.restaurant);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found for this cart');

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (restaurant.minOrderAmount && subtotal < restaurant.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount is ₹${restaurant.minOrderAmount}`);
  }

  let discount = 0;
  if (cart.coupon) {
    const coupon = await Coupon.findById(cart.coupon);
    if (coupon && coupon.isActive && coupon.expiresAt > new Date() && coupon.usedCount < coupon.usageLimit) {
      if (subtotal >= coupon.minOrderAmount) {
        discount =
          coupon.discountType === 'percentage'
            ? (subtotal * coupon.discountValue) / 100
            : coupon.discountValue;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      }
    }
  }

  const deliveryFee = restaurant.deliveryFee || 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const total = Math.max(subtotal + deliveryFee + tax - discount, 0);

  return { restaurant, subtotal, deliveryFee, tax, discount, total };
};

// @desc Create order from cart (COD or after Razorpay verification)
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { addressId, deliveryAddress, paymentMethod = 'cod' } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Your cart is empty');

  const { restaurant, subtotal, deliveryFee, tax, discount, total } = await computeOrderTotals(cart);

  const finalAddress = deliveryAddress;
  if (!finalAddress || !finalAddress.street || !finalAddress.phone) {
    throw new ApiError(400, 'A valid delivery address is required');
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    restaurant: restaurant._id,
    items: cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      quantity: item.quantity,
      price: item.price,
    })),
    deliveryAddress: finalAddress,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    coupon: cart.coupon || null,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    status: 'placed',
    statusHistory: [{ status: 'placed', at: new Date() }],
    estimatedDeliveryTime: new Date(Date.now() + (restaurant.avgDeliveryTime || 35) * 60 * 1000),
  });

  if (cart.coupon) {
    await Coupon.findByIdAndUpdate(cart.coupon, { $inc: { usedCount: 1 } });
  }

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], restaurant: null, coupon: null });

  await Notification.create({
    user: req.user._id,
    title: 'Order Placed',
    message: `Your order #${order.orderNumber} has been placed successfully.`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  res.status(201).json({ success: true, order });
});

// @desc Get logged in user's orders
// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name image').sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc Get single order
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "restaurant",
    select: "owner name",
  });
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin && req.user.role !== 'restaurant' && req.user.role !== 'delivery') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.status(200).json({ success: true, order });
});

// @desc Get orders for a restaurant (restaurant owner dashboard)
// @route GET /api/orders/restaurant/:restaurantId
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const orders = await Order.find({ restaurant: restaurant._id }).populate('user', 'name phone').sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc Update order status
// @route PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "placed",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(req.params.id)
.populate("restaurant");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!order.restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const isAdmin = req.user.role === "admin";
  const isDelivery = req.user.role === "delivery";

  const isRestaurantOwner =
  order.restaurant &&
  order.restaurant.owner &&
  order.restaurant.owner.equals(req.user._id);
  if (!isAdmin && !isDelivery && !isRestaurantOwner) {
    throw new ApiError(403, "Not authorized");
  }

  order.status = status;

  order.statusHistory.push({
    status,
    at: new Date(),
  });

  if (status === "delivered") {
    order.deliveredAt = new Date();

    if (order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }
  }

  await order.save();

  await Notification.create({
    user: order.user,
    title: "Order Update",
    message: `Your order #${order.orderNumber} is now ${status.replace(
      /_/g,
      " "
    )}.`,
    type: "order",
    link: `/orders/${order._id}`,
  });

  res.status(200).json({
    success: true,
    order,
  });
});
// @desc Cancel order (customer)
// @route PATCH /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order.restaurant) {

    console.log("Restaurant Missing");
    console.log(order);

    throw new ApiError(404, "Restaurant not found");
}
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorized');
  if (['out_for_delivery', 'delivered'].includes(order.status)) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.statusHistory.push({ status: 'cancelled', at: new Date() });
  await order.save();

  res.status(200).json({ success: true, order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
};
