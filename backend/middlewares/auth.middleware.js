const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. If no cookie token, check Authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 3. If still no token → unauthorized
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided' });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find user without password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user not found' });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { authenticate };
