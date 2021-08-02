const Vegitable = require("./../models/vegitablesModel");
const APIFeatures = require("../util/apiFeatures");
const catshAsync = require("./../util/catshAsync");
const AppError = require("./../util/appError");

exports.getAllVegitables = catshAsync(async (req, res, next) => {
  // BUILD QUERY
  const features = new APIFeatures(Vegitable.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  // EXECUTE QUERY
  const vegitables = await features.query;

  res.status(200).json({
    status: "success",
    results: vegitables.length,
    data: {
      vegitables,
    },
  });
});

exports.getVegitable = catshAsync(async (req, res, next) => {
  const vegi = await Vegitable.findById(req.params.id);

  if (!vegi) {
    return next(
      new AppError(`There is no Vegies for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      vegi,
    },
  });
});

exports.createVegitable = catshAsync(async (req, res, next) => {
  const newVegi = await Vegitable.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newVegi,
    },
  });
});

exports.updateVegitable = catshAsync(async (req, res, next) => {
  const vegi = await Vegitable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vegi) {
    return next(
      new AppError(`There is no Vegies for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      vegi,
    },
  });
});

exports.deleteVegitable = catshAsync(async (req, res, next) => {
  const vegi = await Vegitable.findByIdAndDelete(req.params.id);

  if (!vegi) {
    return next(
      new AppError(`There is no Vegies for this id: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.containVitamine = catshAsync(async (req, res, next) => {
  const vitamine = req.params.vitamine;

  const vegiesContainer = await Vegitable.aggregate([
    {
      $unwind: "$vitamins",
    },
    {
      $match: { vitamins: `${vitamine}` },
    },
    {
      $group: {
        _id: "null",
        vegiesName: { $push: "$name" },
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
      vegiesContainer,
    },
  });
});
