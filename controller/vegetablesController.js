const Vegetable = require("../models/vegetableModel");
const APIFeatures = require("../utils/apiFeatures");
const catshAsync = require("../utils/catshAsync");
const AppError = require("../utils/appError");

exports.getAllVegetables = catshAsync(async (req, res, next) => {
  // BUILD QUERY
  const features = new APIFeatures(Vegetable.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  // EXECUTE QUERY
  const vegetables = await features.query;

  res.status(200).json({
    status: "success",
    results: vegetables.length,
    data: {
      vegetables,
    },
  });
});

exports.getVegetable = catshAsync(async (req, res, next) => {
  const vege = await Vegetable.findById(req.params.id);

  if (!vege) {
    return next(
      new AppError(`There is no Veges for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      vege,
    },
  });
});

exports.createVegetable = catshAsync(async (req, res, next) => {
  const newVege = await Vegetable.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newVege,
    },
  });
});

exports.updateVegetable = catshAsync(async (req, res, next) => {
  const vege = await Vegetable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vege) {
    return next(
      new AppError(`There is no Vegees for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      vege,
    },
  });
});

exports.deleteVegetable = catshAsync(async (req, res, next) => {
  const vege = await Vegetable.findByIdAndDelete(req.params.id);

  if (!vege) {
    return next(
      new AppError(`There is no Vegees for this id: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.containVitamine = catshAsync(async (req, res, next) => {
  const vitamine = req.params.vitamine;

  const vegeesContainer = await Vegetable.aggregate([
    {
      $unwind: "$vitamins",
    },
    {
      $match: { vitamins: `${vitamine}` },
    },
    {
      $group: {
        _id: "null",
        vegeesName: { $push: "$name" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      vegeesContainer,
    },
  });
});
