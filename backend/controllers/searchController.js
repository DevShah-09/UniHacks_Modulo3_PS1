const Post = require('../models/Post');

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @desc    Search posts by keywords and tags
// @route   GET /api/search
// @access  Private
const searchPosts = async (req, res) => {
  try {
    const { query, tags, contentType } = req.query;

    let searchFilter = { organization: req.organization };

    // Search by keywords in title and content
    if (query && query.trim()) {
      const q = query.trim();
      searchFilter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    // Build normalized tag regexes (supports tags param as comma-separated string or array)
    const tagRegexes = [];
    if (tags) {
      const rawTags = Array.isArray(tags) ? tags : String(tags).split(',');
      rawTags.forEach(t => {
        const clean = String(t || '').trim();
        if (clean) tagRegexes.push(new RegExp(`^${escapeRegex(clean)}$`, 'i'));
      });
    }

    // Handle contentType filters
    if (contentType && String(contentType).trim()) {
      const ct = String(contentType).trim().toLowerCase();

      if (ct === 'anonymous') {
        // Anonymous posts => anonymityLevel 3
        searchFilter.anonymityLevel = 3;
      } else if (ct !== 'all') {
        // Treat other content types as tags (case-insensitive exact match)
        tagRegexes.push(new RegExp(`^${escapeRegex(ct)}$`, 'i'));
      }
    }

    // If any tag regexes were collected, require posts to include all selected tags/contentType tag
    if (tagRegexes.length > 0) {
      // Use $all so selectedTags AND contentType tag are both required
      searchFilter.tags = { $all: tagRegexes };
    }

    console.log('🔎 [searchPosts] filter:', JSON.stringify(searchFilter));

    const posts = await Post.find(searchFilter)
      .populate('author', 'fullName email department')
      .sort({ createdAt: -1 });

    // Filter author information based on anonymityLevel
    const filteredPosts = posts.map(post => {
      const postObj = post.toObject();

      if (post.anonymityLevel === 3) {
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

// @desc    Get all tags for organization
// @route   GET /api/search/tags
// @access  Private
const getTags = async (req, res) => {
  try {
    // Get all unique tags from posts in user's organization
    const posts = await Post.find({ organization: req.organization });

    // Aggregate unique tags
    const tagsSet = new Set();
    posts.forEach(post => {
      post.tags.forEach(tag => tagsSet.add(tag));
    });

    const tags = Array.from(tagsSet);

    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by specific tag
// @route   GET /api/search/tag/:tagName
// @access  Private
const getPostsByTag = async (req, res) => {
  try {
    const { tagName } = req.params;

    const posts = await Post.find({
      organization: req.organization,
      tags: tagName
    })
      .populate('author', 'fullName email department')
      .sort({ createdAt: -1 });

    // Filter author information based on anonymityLevel
    const filteredPosts = posts.map(post => {
      const postObj = post.toObject();

      if (post.anonymityLevel === 3) {
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
  searchPosts,
  getTags,
  getPostsByTag
};