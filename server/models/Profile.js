const mongoose = require("mongoose");
require("dotenv").config();

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    trype: String,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
