const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, default: 'Home' }, // Home, Work, Other
    street: { type: String, required: true },
    city: { type: String, default: 'Jammu' },
    state: { type: String, default: 'Jammu & Kashmir' },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    coordinates: { lat: Number, lng: Number },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
