const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1h',
  });
};

module.exports = { generateToken };
