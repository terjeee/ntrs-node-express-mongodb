const ModelTour = require("../models/ModelTour");
const { deleteDocument, patchDocument, createDocument, getDocument } = require("../handlers/factoryHandler");
const AppError = require("../utils/AppError");

// MIDDLEWARE CONTROLLERS //
// MIDDLEWARE CONTROLLERS //

exports.aliasTopTours = (req, _) => {
  req.query.sort = "price";
  req.query.limit = 5;
  req.query.fields = "name,price,ratingAverage,duration";

  next();
};

// CONTROLLERS //
// CONTROLLERS //

exports.getTours = async (request, response) => {
  try {
    // 1. FILTER DATA
    let filter = request.query;
    filter = JSON.stringify(filter);
    filter = filter.replace(/\b(gte?|lte?)\b/g, (string) => `$${string}`);
    filter = JSON.parse(filter);

    // 2a. FIND FILTERED TOURS ON DB
    let query = ModelTour.find(filter);

    // 2b. SORT QUERY
    if (request.query.sort) {
      const sortBy = request.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("price");
    }

    // 2c. FIELD LIMIT QUERY
    if (request.query.fields) {
      const fieldsRequested = request.query.fields.split(",").join(" ");
      query = query.select(fieldsRequested);
    } else {
      query = query.select("-__v");
    }

    // 2d. PAGINATION
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (request.query.page) {
      const numTours = await ModelTour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    // 4. EXECUTE QUERY
    // const tours = await query.explain(); // ! indexing, sjekke documents examined
    const tours = await query;

    // 5. SEND RESPONSE
    response.status(200).send({
      status: "success",
      results: tours.length,
      data: { tours: tours },
    });
  } catch (error) {
    response.status(404).send({
      status: "fail",
      message: error,
    });
  }
};

exports.getTourById = getDocument(ModelTour, { path: "reviews" });
exports.postTour = createDocument(ModelTour);
exports.patchTour = patchDocument(ModelTour);
exports.deleteTour = deleteDocument(ModelTour);

// AGGREGATION //
// AGGREGATION //

exports.getTourStats = async (request, response) => {
  try {
    const stats = await ModelTour.aggregate([
      {
        $match: { duration: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          avgDuration: { $avg: "$duration" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: "EASY" } } }, // ! removes 'EASY' difficulty
    ]);

    response.status(200).send({
      status: "success",
      data: { stats: stats },
    });
  } catch (error) {
    response.status(404).send({
      status: "fail",
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (request, response) => {
  try {
    const reqYear = Number(request.params.year);
    const stats = await ModelTour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${reqYear}-01-01`),
            $lte: new Date(`${reqYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 100 },
    ]);

    response.status(200).send({
      status: "success",
      results: stats.length,
      data: stats,
    });
  } catch (error) {
    response.status(404).send({
      status: "fail",
      message: error,
    });
  }
};
