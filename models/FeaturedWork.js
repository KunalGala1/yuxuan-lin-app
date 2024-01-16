const mongoose = require('mongoose');

// Assuming WorkSchema is defined in another file, you need to import it if necessary
const Work = require('./Work');

const FeaturedWorkSchema = new mongoose.Schema({
  work: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work',
    required: true
  }
});

module.exports = mongoose.model('FeaturedWork', FeaturedWorkSchema);
