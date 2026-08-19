const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null).optional(),
    image: Joi.object({
      filename: Joi.string().allow("", null).optional(),
      url: Joi.string().uri().allow("", null).optional(),
    }).optional(),
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.array().items(Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Boat",
      "Island"
  )).optional(),
    geometry: Joi.object({
      type: Joi.string().valid("Point").required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).optional(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});
