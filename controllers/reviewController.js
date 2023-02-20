const ModelReview = require("../models/ModelReview");

async function getReviews(req, res, next) {
  try {
    const filter = req.params.id ? { tour: req.params.id } : {};

    const reviews = await ModelReview.find(filter);

    res.status(200).send({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postReview(req, res, next) {
  try {
    const newReview = {
      user: req.user._id,
      tour: req.params.id,
      review: req.body.review,
      rating: req.body.rating,
    };

    await ModelReview.create(newReview);

    res.status(200).send({
      status: "success",
      data: newReview,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

function patchReview(req, res, next) {}

function deleteReview(req, res, next) {}

module.exports = { getReviews, postReview };
