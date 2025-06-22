const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    minlength: 2
  },
  manufacturer: {
    type: String,
    required: true,
    minlength: 3
  },
  engine: {
    type: String,
    required: true,
    minlength: 3
  },
  topSpeed: {
    type: Number,
    required: true,
    min: 10
  },
  image: {
    type: String,
    required: true,
    validate: /^https?:\/\/.+/
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Car', carSchema);
