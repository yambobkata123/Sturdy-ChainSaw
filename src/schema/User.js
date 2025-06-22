const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

module.exports = mongoose.model('User', userSchema);
