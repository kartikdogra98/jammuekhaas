const express = require('express');
const router = express.Router();
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate, foodRules } = require('../middleware/validate');

router.get('/', getFoods);
router.get('/:id', getFoodById);

router.post('/', protect, authorize('restaurant', 'admin'), upload.single('image'), validate(foodRules), createFood);
router.put('/:id', protect, authorize('restaurant', 'admin'), upload.single('image'), updateFood);
router.delete('/:id', protect, authorize('restaurant', 'admin'), deleteFood);

module.exports = router;
