const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

router.post("/", wrapAsync(async (req, res) => 
{
    const { destination } = req.body;
    if (!destination || destination.trim() === "")
    {
        req.flash("error", "Nothing was searched");
        return res.redirect("/listings");
    }
    const allListings = await Listing.find({
        $or: [
            { location: { $regex: destination, $options: "i" } },
            { country: { $regex: destination, $options: "i" } },
            { title: { $regex: destination, $options: "i" } },
            { category: { $regex: destination, $options: "i" } },
        ],
    });
    if (allListings.length === 0)
    {
        req.flash("error", `No listings found for "${destination}"`);
        return res.redirect("/listings");
    }
    res.render("listings/categories", { allListings, searchTerm: destination });
}));

module.exports = router;