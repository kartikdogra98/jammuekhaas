const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
  toggleOpenStatus,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const parseJsonFields = require('../middleware/parseJsonFields');
const { validate, restaurantRules } = require('../middleware/validate');

router.get('/', getRestaurants);
router.get('/my/list', protect, authorize('restaurant', 'admin'), getMyRestaurants);
router.get('/:id', getRestaurantById);

router.post(
  '/',
  protect,
  authorize('restaurant', 'admin'),
  upload.single('image'),
  parseJsonFields('address', 'cuisine'),
  validate(restaurantRules),
  createRestaurant
);
router.put(
  '/:id',
  protect,
  authorize('restaurant', 'admin'),
  upload.single('image'),
  parseJsonFields('address', 'cuisine'),
  updateRestaurant
);
router.delete('/:id', protect, authorize('restaurant', 'admin'), deleteRestaurant);
router.patch('/:id/toggle-status', protect, authorize('restaurant', 'admin'), toggleOpenStatus);

module.exports = router;
