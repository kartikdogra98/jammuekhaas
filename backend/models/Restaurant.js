const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine: [{ type: String }],
    image: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
    coverImage: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
    address: {
      street: String,
      city: { type: String, default: 'Jammu' },
      state: { type: String, default: 'Jammu & Kashmir' },
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    phone: { type: String },
    openingTime: { type: String, default: '09:00' },
    closingTime: { type: String, default: '23:00' },
    isOpen: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    minOrderAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 30 },
    avgDeliveryTime: { type: Number, default: 35 }, // minutes
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
