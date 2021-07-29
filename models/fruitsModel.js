const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Fruit must have a name"],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
  },
  vitamins: {
    type: [String],
    require: [true, "Fruit must have vitamins"],
    trim: true,
  },
  healthBenefits: {
    type: String,
    trim: true,
  },
  From: {
    type: String,
    trim: true,
  },
  Organic: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;
