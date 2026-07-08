const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    image: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }], // e.g. bestseller, spicy, new
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Food', foodSchema);
