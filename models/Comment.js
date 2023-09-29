const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Comment", CommentSchema);