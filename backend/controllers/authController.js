const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRandomToken, hashToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: (Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000,
};

// @desc Register new user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const verificationTokenRaw = generateRandomToken();
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'customer',
    emailVerificationToken: hashToken(verificationTokenRaw),
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationTokenRaw}`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your Jammu-e-Khaas account',
      html: `<p>Hi ${user.name},</p><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    });
  } catch (err) {
    console.error('Email sending failed:', err.message);
  }

  const token = generateAccessToken(user._id, user.role);
  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    token,
    user: user.toSafeObject(),
  });
});

// @desc Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');

  const token = generateAccessToken(user._id, user.role);
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toSafeObject(),
  });
});

// @desc Logout
// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

// @desc Verify email
// @route GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const hashed = hashToken(req.params.token);
  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) throw new ApiError(400, 'Verification link is invalid or has expired');

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

// @desc Forgot password - send reset link
// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether the email exists
    return res.status(200).json({
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  }

  const resetTokenRaw = generateRandomToken();
  user.resetPasswordToken = hashToken(resetTokenRaw);
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetTokenRaw}`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your Jammu-e-Khaas password',
      html: `<p>You requested a password reset. Click the link below (valid for 1 hour):</p><a href="${resetUrl}">${resetUrl}</a><p>If you didn't request this, ignore this email.</p>`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Failed to send reset email. Please try again later.');
  }

  res.status(200).json({
    success: true,
    message: 'If an account exists for that email, a reset link has been sent.',
  });
});

// @desc Reset password
// @route POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  const hashed = hashToken(req.params.token);
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) throw new ApiError(400, 'Reset link is invalid or has expired');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful. Please log in.' });
});

// @desc Google OAuth callback - expects a verified Google id_token payload from client
// @route POST /api/auth/google
// NOTE: This endpoint expects the frontend to verify the Google ID token via
// Google Identity Services and send { googleId, email, name, avatarUrl }.
// For full production use, verify the token server-side with google-auth-library.
const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, email, name, avatarUrl } = req.body;
  if (!googleId || !email) throw new ApiError(400, 'Missing Google account details');

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email,
      googleId,
      isEmailVerified: true,
      avatar: avatarUrl ? { url: avatarUrl } : undefined,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  const token = generateAccessToken(user._id, user.role);
  res.cookie('token', token, cookieOptions);

  res.status(200).json({ success: true, token, user: user.toSafeObject() });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
};
