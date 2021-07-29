const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ` ${__dirname}/config.env ` });
const Vegitable = require("./../../models/vegitablesModel");
const Fruit = require("./../../models/fruitsModel");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DPASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((cont) => console.log("DB is succesfully connected"));

const vegitables = JSON.parse(
  fs.readFileSync(`${__dirname}/vegitables.json`, "utf-8")
);

const fruits = JSON.parse(fs.readFileSync(`${__dirname}/fruits.json`, "utf-8"));

const importVegies = async () => {
  try {
    await Vegitable.create(vegitables);
    console.log("Data successfuly loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteVegies = async () => {
  try {
    await Vegitable.deleteMany();
    console.log("Data successfuly deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importFruits = async () => {
  try {
    await Fruit.create(fruits);
    console.log("Data successfuly loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteFruits = async () => {
  try {
    await Fruit.deleteMany();
    console.log("Data successfuly deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--importvegies") {
  importVegies();
} else if (process.argv[2] === "--deletevegies") {
  deleteVegies();
} else if (process.argv[2] === "--importfruits") {
  importFruits();
} else if (process.argv[2] === "-deletefruits") {
  deleteFruits();
}
