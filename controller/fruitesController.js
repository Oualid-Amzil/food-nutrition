const Fruit = require("../models/fruitsModel");
const APIFeatures = require("./../util/apiFeatures");
const catshAsync = require("./../util/catshAsync");
const AppError = require("./../util/appError");

exports.getAllFruits = catshAsync(async (req, res, next) => {
  const feature = new APIFeatures(Fruit.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagenate();

  const fruits = await feature.query;

  res.status(200).json({
    status: "success",
    results: fruits.length,
    data: {
      fruits,
    },
  });
});

exports.getFruit = catshAsync(async (req, res, next) => {
  const fruit = await Fruit.findById(req.params.id);

  if (!fruit) {
    return next(
      new AppError(`There is no Fruit with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      fruit,
    },
  });
});

exports.createFruit = catshAsync(async (req, res, next) => {
  const newFruit = await Fruit.create(req.body);

  res.status(200).json({
    status: "success",
    results: fruits.length,
    data: {
      newFruit,
    },
  });
});

exports.updateFruit = catshAsync(async (req, res, next) => {
  const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!fruit) {
    return next(
      new AppError(`There is no Fruit with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      fruit,
    },
  });
});

exports.deleteFruit = catshAsync(async (req, res, next) => {
  const fruit = await Fruit.findByIdAndDelete(req.params.id);

  if (!fruit) {
    return next(
      new AppError(`There is no Fruit with this id: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
