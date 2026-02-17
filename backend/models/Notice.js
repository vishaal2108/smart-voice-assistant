const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String
});

module.exports = mongoose.model("Notice", noticeSchema);
