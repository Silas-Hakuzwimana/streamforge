const express = require('express');
const { asyncHandler } = require('../middlewares/error.middleware');
const router = express.Router();
const {
  register,
  login,
  verifyOtp,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

// Auth
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
