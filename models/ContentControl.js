const mongoose = require("mongoose");

const ContentControlSchema = mongoose.Schema({
    content: {
        type: String,
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
    parentPlaceholder: {
        type: mongoose.Types.ObjectId,
        ref: 'placeholder'
    }
});

module.exports = mongoose.model("ContentControl", ContentControlSchema);