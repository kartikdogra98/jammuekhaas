const ApiError = require('../utils/ApiError');
const validator = require('validator');

// Generic validate middleware: takes a function (body) => [errorStrings]
const validate = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body) || [];
  if (errors.length > 0) {
    throw new ApiError(400, 'Validation failed', errors);
  }
  next();
};

const rules = {
  registerRules: (body) => {
    const errors = [];
    if (!body.name || body.name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!body.email || !validator.isEmail(body.email)) errors.push('A valid email is required');
    if (!body.password || body.password.length < 6) errors.push('Password must be at least 6 characters');
    if (body.role && !['customer', 'restaurant', 'delivery'].includes(body.role)) {
      errors.push('Invalid role selected');
    }
    return errors;
  },
  loginRules: (body) => {
    const errors = [];
    if (!body.email || !validator.isEmail(body.email)) errors.push('A valid email is required');
    if (!body.password) errors.push('Password is required');
    return errors;
  },
  foodRules: (body) => {
    const errors = [];
    if (!body.name) errors.push('Food name is required');
    if (!body.price || Number(body.price) <= 0) errors.push('Price must be greater than 0');
    if (!body.category) errors.push('Category is required');
    return errors;
  },
  restaurantRules: (body) => {
    const errors = [];
    if (!body.name) errors.push('Restaurant name is required');
    if (!body.address || !body.address.street) errors.push('Street address is required');
    return errors;
  },
  addressRules: (body) => {
    const errors = [];
    if (!body.street) errors.push('Street is required');
    if (!body.pincode) errors.push('Pincode is required');
    if (!body.phone) errors.push('Phone number is required');
    return errors;
  },
  couponRules: (body) => {
    const errors = [];
    if (!body.code) errors.push('Coupon code is required');
    if (!body.discountValue || Number(body.discountValue) <= 0) errors.push('Discount value must be greater than 0');
    if (!body.expiresAt) errors.push('Expiry date is required');
    return errors;
  },
  reviewRules: (body) => {
    const errors = [];
    if (!body.rating || body.rating < 1 || body.rating > 5) errors.push('Rating must be between 1 and 5');
    if (!body.order) errors.push('Order reference is required');
    return errors;
  },
};

module.exports = { validate, ...rules };
