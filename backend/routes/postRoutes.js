const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { ensureOrgMember } = require('../middleware/orgScopeMiddleware');

// All post routes require authentication and org membership
router.use(protect);
router.use(ensureOrgMember);

// POST /api/posts - Create a new post
router.post('/', createPost);

// GET /api/posts - Get all posts in organization
router.get('/', getPosts);

// GET /api/posts/:postId - Get single post (must be after other specific routes if any)
router.get('/:postId', getPost);

// PUT /api/posts/:postId - Update post
router.put('/:postId', updatePost);

// DELETE /api/posts/:postId - Delete post
router.delete('/:postId', deletePost);

module.exports = router;