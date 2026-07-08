const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getAssignedOrders,
  getAvailableOrders,
  acceptOrder,
} = require('../controllers/deliveryPartnerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('delivery', 'admin'));

router.post('/profile', createProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/orders', getAssignedOrders);
router.get('/available-orders', getAvailableOrders);
router.patch('/orders/:id/accept', acceptOrder);

module.exports = router;
