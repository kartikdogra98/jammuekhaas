const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: { type: String, enum: ['bike', 'scooter', 'bicycle', 'car'], default: 'bike' },
    vehicleNumber: { type: String },
    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    rating: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
