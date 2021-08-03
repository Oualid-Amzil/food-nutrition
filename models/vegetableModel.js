const mongoose = require("mongoose");

const vegetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "vegetable must have a name"],
    unique: true,
    trim: true,
    minlength: 4,
  },
  energy: {
    type: String,
  },
  carbohadrates: {
    type: String,
  },
  protein: {
    type: String,
  },
  fat: {
    type: String,
  },
  vitamins: {
    type: [String],
    required: [true, "vegetable must have vitamins"],
    trim: true,
  },
  minerals: {
    type: [String],
    required: [true, "vegetable must have minerals"],
  },
  healthBenefits: {
    type: String,
    trim: true,
  },
  Origin: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Vegetable = mongoose.model("Vegetable", vegetableSchema);

module.exports = Vegetable;
