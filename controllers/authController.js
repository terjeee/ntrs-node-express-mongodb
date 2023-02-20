const crypto = require("crypto");

const ModelUser = require("../models/ModelUser");
const { verifyJWT, res_createSendCookieJWT } = require("../utils/JWT");
const AppError = require("../utils/appError");

// USER CONTROLLERS //
// USER CONTROLLERS //

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await ModelUser.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    });

    res_createSendCookieJWT(res, newUser, 201);
  } catch (error) {
    res.status(404).send({
      status: "fail",
      message: error,
    });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email: reqEmail, password: reqPassword } = req.body;
    const dbUser = await ModelUser.findOne({ email: reqEmail }).select("+password");

    if (!reqEmail || !reqPassword) return next(new AppError("Provide email and password", 400));
    if (!dbUser || !(await dbUser.isCorrectPassword(reqPassword)))
      return next(new AppError("Incorrect email or password", 401));

    res_createSendCookieJWT(res, dbUser, 200);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error,
    });
  }
};

exports.forgotPassword = async function (req, res, next) {
  // find user from req.body
  const user = await ModelUser.findOne({ email: req.body.email });

  if (!user) return next(new AppError("No account was found with this email address", 404));

  // generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateModifiedOnly: true });

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-token/${resetToken}`;
  const message = `Forgot your password? Don't you worry child; ${resetURL}.`;

  try {
    res.status(200).send({
      status: "success",
      token: resetToken,
      message: message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({});

    next(new AppError(error, 500));
  }
};

exports.resetPassword = async function (req, res, next) {
  try {
    // find user based on token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const dbUser = await ModelUser.findOne({ passwordResetToken: hashedToken });

    // guard clauses
    if (!dbUser) return next(new AppError("Invalid token", 400));
    if (dbUser.passwordResetExpires < Date.now()) return next(new AppError("Expired token.", 400));
    if (req.body.password.length < 8) return next(new AppError("Password doenst meet the requirements.", 400));
    if (req.body.password !== req.body.passwordConfirm) return next(new AppError("Passwords are not matching", 400));

    // update changedPasswordAt
    dbUser.password = req.body.password;
    dbUser.passwordConfirm = req.body.passwordConfirm;
    dbUser.passwordResetToken = undefined;
    dbUser.passwordResetExpires = undefined;
    await dbUser.save({ validateModifiedOnly: true });

    //login dbUser by sending JWT

    res_createSendCookieJWT(res, dbUser, 200);
  } catch (error) {
    new AppError(error, 500);
  }
};

exports.updatePassword = async function (req, res, next) {
  try {
    // get user
    const dbUser = await ModelUser.findById(req.user._id).select("+password");

    // check if req.body.password is matching with db
    if (!(await dbUser.isCorrectPassword(req.body.password))) return next(new AppError("Password is incorrect"), 500);
    if (req.body.newPassword !== req.body.newPasswordConfirm)
      return next(new AppError("Confirm password doesnt match", 500));

    //update password
    dbUser.password = req.body.newPassword;
    dbUser.passwordConfirm = req.body.newPasswordConfirm;
    await dbUser.save({ validateModifiedOnly: true });

    res_createSendCookieJWT(res, dbUser, 200);
  } catch (error) {
    new AppError(error, 500);
  }
};

// APPLICATION CONTROLLERS //
// APPLICATION CONTROLLERS //

exports.protectWithLogIn = async function (req, res, next) {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return next(new AppError("Please log in", 401));
    }

    // GET JWT, then VERIFY with SECRET_KEY
    const tokenJWT = req.headers?.authorization.split(" ")[1];
    const verifiedJWT = verifyJWT(tokenJWT);

    // CHECK IF USER EXISTS with userID on the JWT variable (verifyJWT)
    const user = await ModelUser.findById(verifiedJWT.id);
    if (!user) return next(new AppError("User doesn't exist.", 401));

    // CHECK IF USER CHANGED PASSWRD AFTER TOKEN WAS ISSUED
    if (user.isPasswordChangedAfter(verifiedJWT.iat))
      return next(new AppError("User recently changed password. Please log in again", 401));

    // Send user to the next middleware ()
    req.user = user;
    console.log(req.user);

    // grant access to next middleware on route
    next();
  } catch (error) {
    next(new AppError(error, 404));
  }
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    const user = req.user;

    if (roles.length > 0 && !roles.includes(user.role))
      return next(new AppError("You do not have permission to perform this action", 403));

    next();
  };
};
