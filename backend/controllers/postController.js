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
      aiFeedback: {
        mentor: aiFeedback.mentor,
        critic: aiFeedback.critic
      }
    });

    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id).populate('author', 'fullName email department');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'fullName email department');

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

module.exports = {
  createPost,
  getPosts
};