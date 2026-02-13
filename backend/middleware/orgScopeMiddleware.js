const User = require('../models/User');

const ensureOrgMember = async (req, res, next) => {
  try {
    // Get user from auth middleware
    const user = await User.findById(req.user._id);

    if (!user.organization) {
      return res.status(403).json({ message: 'User is not part of any organization' });
    }

    // Attach organization to request
    req.organization = user.organization;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking organization membership' });
  }
};

module.exports = { ensureOrgMember };