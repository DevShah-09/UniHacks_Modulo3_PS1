const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ message: 'Content and post ID are required' });
    }

    // Verify post exists and belongs to user's organization
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot comment on post from different organization' });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
      organization: req.organization
    });

    const savedComment = await comment.save();
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'fullName department email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Private
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists and belongs to user's organization
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot access comments from different organization' });
    }

    const comments = await Comment.find({ post: postId, organization: req.organization })
      .populate('author', 'fullName department email')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Can only edit your own comments' });
    }

    // Verify organization match
    if (comment.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot edit comment from different organization' });
    }

    comment.content = content;
    const updatedComment = await comment.save();
    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('author', 'fullName department email');

    res.status(200).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Can only delete your own comments' });
    }

    // Verify organization match
    if (comment.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot delete comment from different organization' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};