const express = require("express");

const authController = require("../controllers/authController");
const tourController = require("../controllers/tourController");

const reviewRouter = require("../routes/reviewRouter");

const router = express.Router();

// ROUTER MIDDLEWARE
// ROUTER MIDDLEWARE

router.use("/:id/reviews", reviewRouter); // ! redirects: api/v1/tours/:id/review -> reviewrouter

// ROUTES //
// ROUTES //

router.route("/").get(tourController.getTours).post(tourController.postTour);
router.route("/best-value").get(tourController.aliasTopTours, tourController.getTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/tour-stats")
  .get(authController.protectWithLogIn, authController.restrictTo("admin"), tourController.getTourStats);
router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.patchTour)
  .delete(authController.protectWithLogIn, authController.restrictTo("admin"), tourController.deleteTour);

module.exports = router;
