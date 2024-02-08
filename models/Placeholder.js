const mongoose = require("mongoose");

const PlaceholderSchema = mongoose.Schema({
    isEmpty: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    editedAt: {
        type: Date,
        requiured: true
    },
    contentControls: [{
        type: mongoose.Types.ObjectId,
        ref: 'ContentControl'
    }]
});

module.exports = mongoose.model("Placeholder", PlaceholderSchema);