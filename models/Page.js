const mongoose = require("mongoose");

const PageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    placeholders: [{
        type: mongoose.Types.ObjectId,
        ref: 'placeholder'
    }],
    createdAt: {
        type: Date,
        required: true
    },
    editedAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Page", PageSchema);