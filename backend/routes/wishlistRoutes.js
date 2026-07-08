const express = require('express');
const router = express.Router();
const { getWishlist, toggleFood, toggleRestaurant } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getWishlist);
router.post('/food/:foodId', toggleFood);
router.post('/restaurant/:restaurantId', toggleRestaurant);

module.exports = router;
