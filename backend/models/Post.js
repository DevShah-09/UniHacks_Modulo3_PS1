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
    aiFeedback: {
        mentor: {
            type: String
        },
        critic: {
            type: String
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);