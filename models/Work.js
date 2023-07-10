const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Work', WorkSchema, 'works');
