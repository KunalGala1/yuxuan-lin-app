const mongoose = require("mongoose");

const ArrangementSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Arrangement",
  ArrangementSchema,
  "arrangements"
);
