const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Link', LinkSchema, 'links');
