const mongoose = require("mongoose");

const subjectMarkSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    mark: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const studentPerformanceSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    attendancePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    subjects: {
      type: [subjectMarkSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one subject mark is required",
      },
      required: true,
    },
    overallPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

studentPerformanceSchema.index({ studentEmail: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("StudentPerformance", studentPerformanceSchema);
