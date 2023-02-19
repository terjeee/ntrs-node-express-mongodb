const ModelReview = require("../models/ModelReview");

async function getReviews(req, res, next) {
  const reviews = await ModelReview.find();

  try {
    res.status(200).send({
      status: "success",
      data: { reviews: reviews },
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postReview(req, res, next) {
  try {
    const review = {
      tour: req.body.tour,
      user: req.body.user,
      review: req.body.review,
      rating: req.body.rating,
    };

    await ModelReview.create(review);

    res.status(200).send({
      status: "success",
      data: { newReview: review },
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { getReviews, postReview };
