const AppError = require("./../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const messageArray = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid value. ${messageArray.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicatedErrorDB = (err) => {
  const inputValue = Object.values(err.keyValue);
  const message = `Duplicated Value: "${inputValue[0]}". Please try another One.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalide Token. Please log in again.", 401);

const handleExpiresError = () =>
  new AppError("The token has expired. Please log in again.", 401);

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong.",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.code === 11000) err = handleDuplicatedErrorDB(err);

    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "JsonExpiresError") err = handleExpiresError(err);

    sendErrorProd(err, res);
  }
};
