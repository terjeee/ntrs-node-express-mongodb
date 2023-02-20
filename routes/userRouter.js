const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// .get() = GET request
// .post() = POST request
// .patch() = PATCH request (oppdaterer bare felt med i request.body)
// .delete = DELETE requst
// Når routen brukes ser applikasjonen gjennom header-dataen for å se hvilken type request som etterspørs. I oppsettet under ser applikasjonen først om det er en GET-request, så POST/PATCH, så DELETE for /:id

router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:token").patch(authController.resetPassword);

router.use(authController.protectWithLogIn);

router.route("/get-me").get(userController.getMe, userController.getUser);
router.route("/update-me").patch(userController.getMe, userController.patchUser);
router.route("/update-password").patch(userController.getMe, authController.updatePassword);

router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser).patch(userController.patchUser).delete(userController.deleteUser);

module.exports = router;
