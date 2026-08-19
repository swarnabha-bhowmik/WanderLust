const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) =>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to access");
        return res.redirect("/login");
    }
    next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.currUser._id)))
    {
        req.flash("error", "Access Denied");
        return res.redirect("/listings");
    }
    next();
});

module.exports.isAuthor = wrapAsync(async (req, res, next) =>
{
    const {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(review.owner._id.equals(res.locals.currUser._id)))
    {
        req.flash("error", "Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.saveRedirectUrl = (req, res, next) => 
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    else
    {
        res.locals.redirectUrl = "/listings";
    }
    next();
}

module.exports.validateListing = (req, res, next) =>
{
    let {err} = listingSchema.validate(req.body.listing);
    if (err)
    {
        let errMsg = err.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    next();
};

module.exports.validateReview = (req, res, next) =>
{
    let {err} = reviewSchema.validate(req.body.review);
    if (err)
    {
        let errMsg = err.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    next();
};