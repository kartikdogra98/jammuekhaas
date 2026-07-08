const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/restaurant/:restaurantId', authorize('restaurant', 'admin'), getRestaurantOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorize('restaurant', 'admin', 'delivery'), updateOrderStatus);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
