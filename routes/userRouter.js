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

router.route("/update-password").patch(authController.protectWithLogIn, authController.updatePassword);
router.route("/update-information").patch(authController.protectWithLogIn, authController.updateInformation);
router.route("/inactivate-account").delete(authController.protectWithLogIn, authController.inactivateAccount);

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/:id").get(userController.getUserById).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
