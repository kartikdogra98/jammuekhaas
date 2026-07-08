const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc Get all active coupons (public listing)
// @route GET /api/coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ isActive: true, expiresAt: { $gt: new Date() } });
  res.status(200).json({ success: true, coupons });
});

// @desc Apply coupon to cart
// @route POST /api/coupons/apply
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isActive) throw new ApiError(404, 'Invalid coupon code');
  if (coupon.expiresAt < new Date()) throw new ApiError(400, 'This coupon has expired');
  if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'This coupon has reached its usage limit');

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Your cart is empty');

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
  }

  cart.coupon = coupon._id;
  await cart.save();

  let discount =
    coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.status(200).json({ success: true, message: 'Coupon applied', discount, coupon });
});

// @desc Remove coupon from cart
// @route DELETE /api/coupons/remove
const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { coupon: null });
  res.status(200).json({ success: true, message: 'Coupon removed' });
});

// @desc Create coupon (admin)
// @route POST /api/coupons
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc Update coupon (admin)
// @route PUT /api/coupons/:id
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.status(200).json({ success: true, coupon });
});

// @desc Delete coupon (admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});

module.exports = { getCoupons, applyCoupon, removeCoupon, createCoupon, updateCoupon, deleteCoupon };
