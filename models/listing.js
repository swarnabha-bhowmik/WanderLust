const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: 
    {
        type: String,
        required: true
    },
    description: 
    {
        type: String
    },
    image: 
    {
        filename: String,
        url: 
        {
            type: String,
            default: "https://images.unsplash.com/photo-1712651429891-a73046beecfd?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1712651429891-a73046beecfd?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        }
    },
    price: 
    {
        type: Number,
        required: true
    },
    location: 
    {
        type: String,
        required: true
    },
    country: 
    {
        type: String,
        required: true
    },
    reviews: 
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category:
    {
        type: [String],
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Boat", "Island"]
    },
    geometry:
    {
        type:
        {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates:
        {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing)
    await Review.deleteMany({_id: {$in: listing.reviews}});
});

module.exports = mongoose.model('Listing', listingSchema);