const mongoose = require("mongoose");

const staffAssignmentSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    profilePdfUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StaffAssignment", staffAssignmentSchema);
