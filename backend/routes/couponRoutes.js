const express = require('express');
const router = express.Router();
const {
  getCoupons,
  applyCoupon,
  removeCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');
const { validate, couponRules } = require('../middleware/validate');

router.get('/', getCoupons);
router.post('/apply', protect, applyCoupon);
router.delete('/remove', protect, removeCoupon);

router.post('/', protect, authorize('admin'), validate(couponRules), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;
