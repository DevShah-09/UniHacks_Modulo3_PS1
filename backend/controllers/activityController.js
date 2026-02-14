const User = require('../models/User');

// GET /api/activity/unread
const getUnreadCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('unreadActivityCount');
    return res.status(200).json({ count: user?.unreadActivityCount || 0 });
  } catch (error) {
    console.error('[getUnreadCount] Error:', error);
    return res.status(500).json({ message: 'Failed to read unread activity count' });
  }
};

// POST /api/activity/clear
const clearUnreadCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.unreadActivityCount = 0;
    await user.save();
    return res.status(200).json({ success: true, count: 0 });
  } catch (error) {
    console.error('[clearUnreadCount] Error:', error);
    return res.status(500).json({ message: 'Failed to clear unread activity count' });
  }
};

module.exports = { getUnreadCount, clearUnreadCount };