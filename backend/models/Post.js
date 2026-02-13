const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    summary: {
        type: String
    },
    tags: [{
        type: String
    }],
    anonymityLevel: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    // Likes: store references to users who liked this post
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    aiFeedback: {
        mentor: {
            type: String
        },
        critic: {
            type: String
        },
        strategist: {
            type: String
        },
        executionManager: {
            type: String
        },
        riskEvaluator: {
            type: String
        },
        innovator: {
            type: String
        }
    },
    sentiment: {
        label: {
            type: String,
            enum: ['positive', 'negative', 'neutral', 'mixed']
        },
        score: {
            type: Number,
            min: 0,
            max: 1
        },
        emotions: [String],
        explanation: String
    },
    perspectives: {
        customerPerspective: String,
        competitorPerspective: String,
        newHirePerspective: String
    },
    scrubbedContent: {
        type: String
    },
    relatedPostIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    contextRelations: [
        {
            postId: mongoose.Schema.Types.ObjectId,
            relevance: Number,
            reason: String
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);