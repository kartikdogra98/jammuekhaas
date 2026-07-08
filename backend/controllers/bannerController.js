const Banner = require('../models/Banner');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc Get active banners
// @route GET /api/banners
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
  res.status(200).json({ success: true, banners });
});

// @desc Create banner (admin)
// @route POST /api/banners
const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Banner image is required');
  const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/banners');
  const banner = await Banner.create({
    ...req.body,
    image: { url: result.secure_url, public_id: result.public_id },
  });
  res.status(201).json({ success: true, banner });
});

// @desc Update banner (admin)
// @route PUT /api/banners/:id
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'jammu-e-khaas/banners');
    req.body.image = { url: result.secure_url, public_id: result.public_id };
  }

  Object.assign(banner, req.body);
  await banner.save();
  res.status(200).json({ success: true, banner });
});

// @desc Delete banner (admin)
// @route DELETE /api/banners/:id
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.status(200).json({ success: true, message: 'Banner deleted' });
});

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
