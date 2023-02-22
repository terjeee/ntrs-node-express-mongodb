const mongoose = require("mongoose");

const ModelUser = require("./ModelUser");

// SCHEMA = BLUEPRINT of DATABASE-DOCUMENTS //
// SCHEMA = BLUEPRINT of DATABASE-DOCUMENTS //

const schemaTour = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is missing!"],
      unique: [true, "Tour already exists."],
      maxLength: [40, "Name too long. MAX: 40 characters."],
      minLength: [4, "Name is too short. MIN: 10 characters"],
    },
    description: {
      type: String,
      trim: true,
      require: [true, "Missing description."],
    },
    price: {
      type: Number,
      required: [true, "Price is missing!"],
    },
    difficulty: {
      type: String,
      required: [true, "Missing difficulty."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: 'Difficulty has to be "easy", "meadium", "difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Rating is too low. MIN: 0"],
      max: [5, "Rating is too high. MAX: 5"],
    },
    ratingsQuantity: {
      type: Number,
      required: false,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "Missing duration."],
    },
    startLocation: {
      // ! GeoJSON = type: {}, coordinates: []
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], // ! [longitude, latitude]
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: "Point",
        },
        coordinates: [Number], // ! [longitude, latitude]
        address: String,
        description: String,
        day: Number,
      },
    ],
    images: [String],
    imageCover: {
      type: String,
      required: [false, "Missing cover image."],
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    maxGroupSize: {
      type: Number,
      required: [false, "Missing group size."],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // Only runs for newly created documents, not on update
        message: "Discounted price ({VALUE}) is higher, or equal to the original price.",
        validator: function (value) {
          return value < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      require: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// CREATE INDEX // index({kategori, acending/decending{}) // ! .examine() på await Model.find()
// CREATE INDEX // index({kategori, acending/decending{}) // ! .examine() på await Model.find()

// schemaTour.index({ price: 1 });
schemaTour.index({ price: 1, ratingsAverage: -1 });
schemaTour.index({ slug: 1 });

// VIRTUAL FIELDS = Not saved on DB, but sent as a field to user //
// VIRTUAL FIELDS = Not saved on DB, but sent as a field to user //

schemaTour.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

schemaTour.virtual("priceNOK").get(function () {
  return this.price * 10;
});

// ! VIRTUAL POPULATE
schemaTour.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() //
// DOCUMENT MIDDLEWARE: runs before .save() and .create() 7/

schemaTour.pre("save", function (next) {
  console.log("✅ PRE DOCUMENT MIDDLEWARE");
  next();
});

schemaTour.post("save", function (document, next) {
  console.log("✅ POST DOCUMENT MIDDLEWARE");
  next();
});

// // ! EMBEDDING Guides[]
// schemaTour.pre("save", async function (next) {
//   const promiseGuides = this.guides.map(async (id) => await ModelUser.findOne({ _id: id }));
//   this.guides = await Promise.all(promiseGuides);
//   next();
// });

// QUERY MIDDLEWARE = FIND()
// QUERY MIDDLEWARE = FIND()

schemaTour.pre(/^find/, function (next) {
  this.startTimerQuery = Date.now();
  next();
});

schemaTour.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
    .select("-__v")
    .populate({ path: "guides", select: "-__v" });

  next();
});

schemaTour.post(/^find/, function (documents, next) {
  console.log(`✅ QUERY TOOK: ${Date.now() - this.startTimerQuery}ms`);
  next();
});

// AGGREGATION MIDDLEWARE = runs before/after aggregation //
// AGGREGATION MIDDLEWARE = runs before/after aggregation //

schemaTour.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log("PIPELINE: ", this.pipeline());

  next();
});
{
}
// EXPORT //
// EXPORT //

module.exports = mongoose.model("Tour", schemaTour);
