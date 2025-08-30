const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1h',
  });
};

const generateResetToken = async () => {
  crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
};
module.exports = { generateToken, generateResetToken };
