const mongoose = require("mongoose");
const Student = require("../models/Student");

const MONGO_URI = "mongodb://127.0.0.1:27017/smart_voice_assistant";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const match = { department: { $regex: /^\s*c\.?s\.?e\.?\s*$/i } };
    const update = { $set: { department: "IT" } };

    const beforeCount = await Student.countDocuments(match);
    const result = await Student.updateMany(match, update);

    console.log(`Matched: ${beforeCount}`);
    console.log(`Modified: ${result.modifiedCount ?? result.nModified ?? 0}`);
  } catch (error) {
    console.error("Update failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
