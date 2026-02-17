const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  companyName: String,
  package: String,
  eligibility: String,
  date: String
});

module.exports = mongoose.model("Placement", placementSchema);
