const mongoose = require("mongoose");

const vegitableSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "vegitable must have a name"],
    unique: true,
    trim: true,
    minlength: [5, "The name must containe more than 5 cataracters"],
  },
  price: {
    type: Number,
  },
  vitamins: {
    type: [String],
    require: [true, "vegitable must have vitamins"],
    trim: true,
  },
  healthBenefits: {
    type: String,
    trim: true,
  },
  from: {
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

const Vegitable = mongoose.model("Vegitable", vegitableSchema);

module.exports = Vegitable;
