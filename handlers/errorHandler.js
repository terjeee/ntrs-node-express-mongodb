const sendErrorDev = (error, res) => {
  console.log("hei");

  res.status(error.statusCode).send({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  console.log("hei");

  if (error.isOperational) {
    // trusted error: send details to client
    res.status(error.statusCode).send({
      status: error.status,
      message: error.message,
    });
  } else {
    // unknown error: dont leak details
    console.error(`❌ ERROR: ${error}`);
    res.status(error.statusCode).send({
      status: "error",
      message: "Something went wrong.",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || error;

  console.log("hei");

  if (process.env.NODE_ENV.trim() === "development") sendErrorDev(error, res);
  if (process.env.NODE_ENV.trim() === "production") sendErrorProd(error, res);
};
