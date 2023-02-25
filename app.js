const express = require("express");
const path = require("path");
const expressRateLimit = require("express-rate-limit"); // https://www.npmjs.com/package/express-rate-limit
const helmet = require("helmet"); // https://www.npmjs.com/package/helmet
const mongoSanitize = require("express-mongo-sanitize"); // https://www.npmjs.com/package/express-mongo-sanitize
const hpp = require("hpp"); // https://www.npmjs.com/package/hpp
const morgan = require("morgan"); // https://www.npmjs.com/package/morgan

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");

const AppError = require("./utils/appError");
const errorHandler = require("./handlers/errorHandler");

const app = express();

// ENABLE DEVELOPEMENT-MODE (Moragan) from .env file
// ENABLE DEVELOPEMENT-MODE (Moragan) from .env file

console.log("✅ ENVIRONMENT =", process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "development") app.use(morgan("dev"));

// GLOBALMIDDLEWARE
// GLOBALMIDDLEWARE

// ! parse input-date til req.body. Uten, console.log(req.body) = undefined
// ! limits req.body size > setLimit
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public"))); // !serving static files

const rateLimit = expressRateLimit({
  max: 10, // Limit each IP to X requests per `window` (here, per 15 minutes)
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request from this IP. Please try again in 15 mintues.",
});

app.use("/api/", rateLimit); // ! limits requests from same IP
app.use(helmet()); // ! security: set HTTP-headers
app.use(mongoSanitize()); // ! sanitize request(inputs) mot NoSQL attacks
app.use(hpp({ whitelist: ["duration", "price"] })); // ! HTTP parameter pollution (duplicate): LAST MIDDLEWARE IN STACK

// ROUTES
// ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  // const error = new Error(`$✅ ERROR MIDDLEWARE - {req.originalUrl} doesn't exist!`);
  // const error = new AppError(`✅ MIDDLEWARE ERROR - ${req.originalUrl} doesn't exist!`, 404);
  next(new AppError(`✅ MIDDLEWARE ERROR - ${req.originalUrl} doesn't exist!`, 404));
});

//  GLOBAL ERROR HANDLING
//  GLOBAL ERROR HANDLING

app.use(errorHandler);

module.exports = app;
