const User = require('../models/User');
const Otp = require('../models/Otp');
const crypto = require('crypto');

const {
  sendOtpEmail,
  sendResetEmail,
  sendWelcomeEmail,
} = require('../services/email.service');
const { generateOtpCode } = require('../utils/generateOTP');
const { generateToken } = require('../utils/generateToken');

// -------------------- CONTROLLERS --------------------

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password });

  await sendWelcomeEmail(user.email, user.name);

  res
    .status(201)
    .json({ message: 'User registered successfully', userId: user._id });
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid email or password' });

  // Generate OTP
  const otpCode = generateOtpCode();
  const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Save OTP (plain text)
  await Otp.findOneAndUpdate(
    { userId: user._id }, // filter by user
    { otpCode: hashedOtp, expiresAt }, // update fields
    { upsert: true, new: true }, // create if not exists
  );

  const userName = user.name.split(' ')[0];

  // Send OTP via email
  await sendOtpEmail(user.email, otpCode, userName);

  res.status(200).json({ message: 'OTP sent to your email', userId: user._id });
};

// -------------------- VERIFY OTP --------------------
exports.verifyOtp = async (req, res) => {
  const { userId, otpCode } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Find OTP entry
  const otpEntry = await Otp.findOne({ userId });
  if (!otpEntry)
    return res.status(400).json({ message: 'OTP not found or expired' });

  const now = Date.now();
  const expirationTime = otpEntry.expiresAt;

  // Check expiration
  if (expirationTime < Date.now()) {
    await otpEntry.deleteOne();
    return res.status(400).json({ message: 'OTP expired' });
  }

  // Plain text comparison
  const hashedInput = crypto.createHash('sha256').update(otpCode).digest('hex');
  if (otpEntry.otpCode !== hashedInput) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid → delete it
  await otpEntry.deleteOne();

  // Generate JWT token
  const token = generateToken(userId);

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .status(200)
    .json({
      message: 'OTP verified, login successful',
      token, // optional if frontend wants to store in localStorage
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  // res.status(200).json({ message: 'OTP verified, login successful' });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a reset token (plain)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before saving in DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const userName = user.name.split(' ')[0];

    // Send reset email with plain token in URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetUrl, userName);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
