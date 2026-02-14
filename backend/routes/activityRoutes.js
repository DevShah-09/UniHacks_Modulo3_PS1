const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUnreadCount, clearUnreadCount } = require('../controllers/activityController');

// GET /api/activity/unread  -> { count }
router.get('/unread', protect, getUnreadCount);

// POST /api/activity/clear  -> clears unread count for current user
router.post('/clear', protect, clearUnreadCount);

module.exports = router;