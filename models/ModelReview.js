const mongoose = require("mongoose");

// SCHEMA (blueprint) //
// SCHEMA (blueprint) //

const schemaReview = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Provide a tour to the review."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Provide a user to the review."],
    },
    review: {
      type: String,
      required: [true, "Please post a review between 2-50 characters."],
      minlength: 2,
      maxlength: 50,
    },
    rating: {
      type: Number,
      default: 0,
      required: [true, "Keep the rating between 0 and 5."],
      min: 0,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARE: QUERY //
// MIDDLEWARE: QUERY //

schemaReview.pre(/^find/, function (next) {
  this.find().populate([
    // {
    //   path: "tour",
    //   select: ["name"],
    // },
    {
      path: "user",
      select: ["name"],
    },
  ]);

  next();
});

// EXPORT //
// EXPORT //

module.exports = mongoose.model("Review", schemaReview);
