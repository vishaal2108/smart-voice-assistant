const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  department: String,
  year: String,
  totalFee: Number,
  dueDate: String
});

module.exports = mongoose.model("Fee", feeSchema);
