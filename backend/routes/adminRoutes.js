const express = require('express');
const router = express.Router();

const {
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
} = require("../controllers/adminController");

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/restaurants/pending', getPendingRestaurants);
router.patch('/restaurants/:id/approve', approveRestaurant);
router.delete('/restaurants/:id/reject', rejectRestaurant);
router.get("/orders/stats", getOrderStats);
router.get('/orders', getAllOrders);
router.post('/restaurants',upload.single('image'),createRestaurantWithOwner);

module.exports = router;
