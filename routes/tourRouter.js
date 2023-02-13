const express = require("express");

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

// ROUTER MIDDLEWARE
// ROUTER MIDDLEWARE

// router.param("id", tourController.checkId);

// ROUTES //
// ROUTES //

router.route("/").get(tourController.getTours).post(tourController.postTour);
router.route("/best-value").get(tourController.aliasTopTours, tourController.getTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tour-stats").get(authController.protectWithLogIn, tourController.getTourStats);
router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.patchTour)
  .delete(authController.protectWithLogIn, authController.restrictTo("admin", "lead-guide"), tourController.deleteTour);

module.exports = router;
