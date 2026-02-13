const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/posts - Create a new post (protected)
router.post('/', protect, createPost);

// GET /api/posts - Get all posts (protected)
router.get('/', protect, getPosts);

module.exports = router;