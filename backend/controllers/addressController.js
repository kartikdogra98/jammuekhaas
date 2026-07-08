const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc Get all addresses for logged in user
// @route GET /api/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json({ success: true, addresses });
});

// @desc Add address
// @route POST /api/addresses
const addAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const address = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, address });
});

// @desc Update address
// @route PUT /api/addresses/:id
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, 'Address not found');

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.status(200).json({ success: true, address });
});

// @desc Delete address
// @route DELETE /api/addresses/:id
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, 'Address not found');
  res.status(200).json({ success: true, message: 'Address deleted' });
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
