const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  if (!req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, invalid token format' });
  }

  try {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };