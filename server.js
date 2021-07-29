const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });

// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION! Shuting down ...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const app = require("./app");

// console.log(process.env);

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((cont) => console.log("DB is successfully connected"));

const port = process.env.PORT || 8000;

const server = app.listen(5000, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}...`
  );
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shuting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
