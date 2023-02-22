const mongoose = require("mongoose");

const ModelTour = require("./ModelTour");

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

// INDEX //
// INDEX //

// ! ONE REVIEW PER TOUR PER USER
schemaReview.index({ tour: 1, user: 1 }, { unique: true });

// STATIC METHODS //
// STATIC METHODS //

// ! del 1
schemaReview.statics.calcAverageRatings = async function (idTour) {
  const updatedStats = await this.aggregate([
    {
      $match: { tour: idTour }, // $match = find()
    },
    {
      $group: {
        _id: "$tour", // "tour" er fra schemaReview/tour
        numRatings: { $sum: 1 }, // {$sum: 1} = counter++, hver $match-idTour legger på 1 (++)
        avgRating: { $avg: "$rating" }, // $avg = operator, "$rating" er fra schemaReview/rating
      },
    },
  ]);

  if (updatedStats.length <= 0) {
    return await ModelTour.findByIdAndUpdate(idTour, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }

  await ModelTour.findByIdAndUpdate(idTour, {
    ratingsQuantity: updatedStats[0].numRatings,
    ratingsAverage: updatedStats[0].avgRating,
  });
};

// ! del 2
schemaReview.post("save", function () {
  this.constructor.calcAverageRatings(this.tour); // ! this = current review(document)
});

// ! del 3
schemaReview.post(/^findOneAnd/, async function (document) {
  await document.constructor.calcAverageRatings(document.tour);
});

// MIDDLEWARE: QUERY //
// MIDDLEWARE: QUERY //

schemaReview.pre(/^find/, function (next) {
  this.populate([
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
