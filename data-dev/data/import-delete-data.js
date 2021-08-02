const fs = require("fs");
const mongoose = require("mongoose");
const Vegetable = require("./../../models/vegetableModel");
const Fruit = require("./../../models/fruitModel");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../../../config.env` });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => console.log("DB successfuly connected..."));

const vegetables = JSON.parse(
  fs.readFileSync(`${__dirname}/vegetables.json`, "utf-8")
);

const importVegetables = async (req, res) => {
  try {
    await Vegetable.create(vegetables);
    console.log("Vegetables successfuly imported ...");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteVegetables = async (req, res) => {
  try {
    await Vegetable.deleteMany();
    console.log("Vegetables successfuly deleted ...");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importFruits = async (req, res) => {
  try {
    await Fruit.create(vegetables);
    console.log("Fruits successfuly imported ...");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteFruits = async (req, res) => {
  try {
    await Fruit.deleteMany();
    console.log("Fruits successfuly deleted ...");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import-vegetables") {
  importVegetables();
} else if (process.argv[2] === "--delete-vegetables") {
  deleteVegetables();
}

if (process.argv[2] === "--import-fruits") {
  importFruits();
} else if (process.argv[2] === "--delete-fruits") {
  deleteFruits();
}
