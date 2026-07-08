const express = require('express');
const router = express.Router();
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate, reviewRules } = require('../middleware/validate');

router.get('/', getReviews);
router.post('/', protect, validate(reviewRules), createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
