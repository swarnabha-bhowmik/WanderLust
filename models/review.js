const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: 
    {
        type: String,
        required: true,
    },
    rating: 
    {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: 
    {
        type: Date,
        default: Date.now(),
    },
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Review', reviewSchema);