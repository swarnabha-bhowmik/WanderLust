const Listing = require("../models/listing.js");
const {cloudinary} = require("../cloudConfig.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "owner"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const { location, country } = req.body.listing;
  let response = await geocodingClient.forwardGeocode({
  query: `${location}, ${country}`,
  limit: 1
}).send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req, req.file, {
      folder: "wanderlust_listings",
    });
    newListing.image = { url: result.secure_url, filename: result.public_id };
  }

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, req, req.file, {
      folder: "wanderlust_listings",
    });

    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    req.body.listing.image = { url: result.secure_url, filename: result.public_id };
  }

  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (deletedListing && deletedListing.image && deletedListing.image.filename) {
    await cloudinary.uploader.destroy(deletedListing.image.filename);
  }
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};