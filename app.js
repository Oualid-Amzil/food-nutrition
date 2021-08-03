const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const vegetablesRoute = require("./routes/vegetablesRoute");
const fruitsRoute = require("./routes/fruitsRoute");
const userRouter = require("./routes/userRoute");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use("/api", hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});

app.use("/api", limiter);

app.use("/api/v1/vegies", vegetablesRoute);
app.use("/api/v1/fruits", fruitsRoute);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
