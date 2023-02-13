const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorHandler");

const app = express();

// ENABLE DEVELOPEMENT-MODE (Moragan) from .env filem
// ENABLE DEVELOPEMENT-MODE (Moragan) from .env filem
console.log("✅ ENVIRONMENT = ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// MIDDLEWARE
// MIDDLEWARE

app.use((request, response, next) => {
  // console.log("Hello from the middleware! 🙂");
  // console.log(request.headers);
  next();
});
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
// ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // const error = new Error(`$✅ ERROR MIDDLEWARE - {req.originalUrl} doesn't exist!`);
  // const error = new AppError(`✅ MIDDLEWARE ERROR - ${req.originalUrl} doesn't exist!`, 404);
  next(new AppError(`✅ MIDDLEWARE ERROR - ${req.originalUrl} doesn't exist!`, 404));
});

//  ERROR HANDLING
//  ERROR HANDLING

app.use(errorHandler);

module.exports = app;
