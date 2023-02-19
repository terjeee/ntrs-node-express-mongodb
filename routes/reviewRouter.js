const express = require("express");

const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

// ROUTES //
// ROUTES //

router.route("/").get(authController.protectWithLogIn, reviewController.getReviews);
router.route("/").post(authController.protectWithLogIn, authController.restrictTo("user"), reviewController.postReview);

module.exports = router;
