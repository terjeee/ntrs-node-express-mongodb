const ModelReview = require("../models/ModelReview");
const { deleteDocument, patchDocument, getDocument } = require("../handlers/factoryHandler");

async function getReviews(req, res, next) {
  try {
    const filter = req.params.idTour ? { tour: req.params.idTour } : {};

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

const getReview = getDocument(ModelReview);
const patchReview = patchDocument(ModelReview);
const deleteReview = deleteDocument(ModelReview);

module.exports = { getReviews, getReview, postReview, patchReview, deleteReview };
