const Post = require('../models/Post');
const { analyzePost } = require('../services/aiService');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, summary, tags, anonymityLevel } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Validate anonymityLevel
    if (anonymityLevel && ![1, 2, 3].includes(anonymityLevel)) {
      return res.status(400).json({ message: 'Anonymity level must be 1, 2, or 3' });
    }

    // Analyze the post with AI
    const aiFeedback = await analyzePost(content);

    const post = new Post({
      title,
      content,
      summary: summary || aiFeedback.summary || '',
      tags: tags || [],
      anonymityLevel: anonymityLevel || 1,
      author: req.user._id,
      organization: req.organization,
      aiFeedback: {
        mentor: aiFeedback.mentor,
        critic: aiFeedback.critic,
        strategist: aiFeedback.strategist,
        executionManager: aiFeedback.executionManager,
        riskEvaluator: aiFeedback.riskEvaluator,
        innovator: aiFeedback.innovator
      }
    });

    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id).populate('author', 'fullName email department');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts for user's organization
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ organization: req.organization })
      .populate('author', 'fullName email department')
      .sort({ createdAt: -1 });

    // Filter author information based on anonymityLevel
    const filteredPosts = posts.map(post => {
      const postObj = post.toObject();

      if (post.anonymityLevel === 3) {
        // Hide author's name and department for anonymity level 3
        postObj.author = {
          _id: post.author._id,
          email: post.author.email
        };
      }

      return postObj;
    });

    res.status(200).json(filteredPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:postId
// @access  Private
const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('author', 'fullName email department');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify post belongs to user's organization
    if (post.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot access post from different organization' });
    }

    const postObj = post.toObject();

    if (post.anonymityLevel === 3) {
      postObj.author = {
        _id: post.author._id,
        email: post.author.email
      };
    }

    res.status(200).json(postObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:postId
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, tags, anonymityLevel } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Can only edit your own posts' });
    }

    // Verify organization match
    if (post.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot edit post from different organization' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.anonymityLevel = anonymityLevel || post.anonymityLevel;

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'fullName email department');

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Can only delete your own posts' });
    }

    // Verify organization match
    if (post.organization.toString() !== req.organization.toString()) {
      return res.status(403).json({ message: 'Cannot delete post from different organization' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
};