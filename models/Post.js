const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    editedAt: {
        type: Date,
        required: true
    },
    published: {
        date: { type: Date },
        isPublished: { type: Boolean, required: true }
    }
});

module.exports = mongoose.model("Post", PostSchema);