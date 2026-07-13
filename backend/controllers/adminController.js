const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require("../config/cloudinary");


// @desc Get order statistics
// @route GET /api/admin/orders/stats
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();

  const pendingOrders = await Order.countDocuments({
    status: {
      $in: ["placed", "confirmed", "preparing"],
    },
  });

  const deliveredOrders = await Order.countDocuments({
    status: "delivered",
  });

  const revenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$total",
        },
      },
    },
  ]);

  res.json({
    success: true,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenue: revenue[0]?.totalRevenue || 0,
  });
});
// @desc Create Restaurant with Owner (Admin)
// @route POST /api/admin/restaurants
const createRestaurantWithOwner = asyncHandler(async (req, res) => {
  const {
    ownerName,
    ownerEmail,
    ownerPassword,

    name,
    description,
    cuisine,
    address,
    phone,
    openingTime,
    closingTime,
    deliveryFee,
    avgDeliveryTime,
    minOrderAmount,
  } = req.body;

  // Check if owner email already exists
  const existingUser = await User.findOne({ email: ownerEmail });

  if (existingUser) {
    throw new ApiError(400, "Owner email already exists");
  }

  // Create Restaurant Owner
  const owner = await User.create({
    name: ownerName,
    email: ownerEmail,
    password: ownerPassword,
    phone,
    role: "restaurant",
    isEmailVerified: true,
  });

  // Upload Image
  let image = {
    url: "",
    public_id: "",
  };

  if (req.file) {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "jammu-e-khaas/restaurants"
    );

    image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Parse JSON fields
  const parsedCuisine =
    typeof cuisine === "string" ? JSON.parse(cuisine) : cuisine;

  const parsedAddress =
    typeof address === "string" ? JSON.parse(address) : address;

  // Create Restaurant
  const restaurant = await Restaurant.create({
    owner: owner._id,
    name,
    description,
    cuisine: parsedCuisine,
    address: parsedAddress,
    phone,
    openingTime,
    closingTime,
    deliveryFee,
    avgDeliveryTime,
    minOrderAmount,
    image,
    isApproved: true,
  });

  res.status(201).json({
    success: true,
    message: "Restaurant created successfully",
    owner,
    restaurant,
  });
});
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalRestaurants,
    totalOrders,
    totalFoods,
  ] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Order.countDocuments(),
    Food.countDocuments(),
  ]);

  const revenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$total",
        },
      },
    },
  ]);

  const revenueTrend = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: "$total",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const orderStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        value: {
          $sum: 1,
        },
      },
    },
  ]);

  const topRestaurants = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: "$restaurant",
        revenue: {
          $sum: "$total",
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "_id",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $project: {
        _id: 1,
        revenue: 1,
        orders: 1,
        restaurant: {
          name: "$restaurant.name",
          rating: "$restaurant.rating",
          image: "$restaurant.image",
        },
      },
    }
  ]);
  const topFoods = await Food.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "items.food",
        as: "orders",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        price: 1,
        totalOrders: {
          $size: "$orders",
        },
      },
    },
    {
      $sort: {
        totalOrders: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);
  const recentOrders = await Order.find()
  .select("orderNumber total status createdAt user restaurant")
  .populate("user", "name")
  .populate("restaurant", "name")
  .sort({ createdAt: -1 })
  .limit(5);

  res.status(200).json({
    success: true,
  
    stats: {
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalFoods,
      revenue: revenue[0]?.total || 0,
    },
  
    revenueTrend,
    orderStatus,
    topRestaurants,
    topFoods,
    recentOrders,
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

if (req.query.status) {
    query.status = req.query.status;
}

if (req.query.search) {
    query.orderNumber = {
        $regex: req.query.search,
        $options: "i",
    };
}

  if (status) {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("user", "name email")
      .populate("restaurant", "name owner")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    orders,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
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
  createRestaurantWithOwner,
  getOrderStats,
};