const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otpCode: {
      type: String,
      required: true, // plain OTP
    },
    expiresAt: {
      type: Date,
      required: true,
      index:{ expires: '0s'}
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Otp', otpSchema);
