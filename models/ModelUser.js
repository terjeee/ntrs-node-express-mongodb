const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const schemaUser = new mongoose.Schema({
  activeAccount: {
    type: Boolean,
    default: true,
    select: true,
  },
  name: {
    type: String,
    required: [true, "Provide a name :)"],
  },
  email: {
    type: String,
    required: [true, "Provide an email."],
    unique: true,
    lowercase: true,
    validate: {
      validator: emailValidator.validate,
      message: "Email is not valid!",
    },
  },
  role: {
    type: String,
    require: true,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Provide a valid password."],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm password."],
    select: false,
    validate: {
      // THIS ONLY RUNS ON .create() and .save()
      message: "Passwords are not matching.",
      validator: function (string) {
        return string === this.password;
      },
    },
  },
  photo: {
    type: String,
    required: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

// ENCRYPT PASSWORD (PRE-DOCUMENT MIDDLEWARE)
// ENCRYPT PASSWORD (PRE-DOCUMENT MIDDLEWARE)

schemaUser.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // hash/encrypt password with 'cost = 12'
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = null;
  next();
});

schemaUser.pre("save", function (next) {
  if (this.isNew) return next();
  if (!this.isModified("password")) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// QUERY MIDDLEWARE //
// QUERY MIDDLEWARE //

schemaUser.pre(/^find/, function (next) {
  this.find({ activeAccount: { $ne: false } });
  next();
});

// INSTANCES/METHODS
// INSTANCES/METHODS

schemaUser.methods.isCorrectPassword = async function (submittedPassword) {
  return await bcrypt.compare(submittedPassword, this.password);
};

schemaUser.methods.isPasswordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number(this.passwordChangedAt.getTime() / 1000);
    return jwtTimestamp < changedTimestamp;
  }

  return false;
};

schemaUser.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 600000; // 10 minnutter

  return resetToken;
};

// EXPORT MODEL
// EXPORT MODEL

module.exports = mongoose.model("User", schemaUser);
