const express = require("express");

const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true }); // ! merger params fra redirect: /api/v1/tours/:id/reviews

// ROUTES //
// ROUTES //

router
  .route("/")
  .get(reviewController.getReviews)
  .post(authController.protectWithLogIn, authController.restrictTo("user"), reviewController.postReview);
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.protectWithLogIn, authController.restrictTo("user", "admin"), reviewController.patchReview)
  .delete(authController.protectWithLogIn, authController.restrictTo("user", "admin"), reviewController.deleteReview);

module.exports = router;
