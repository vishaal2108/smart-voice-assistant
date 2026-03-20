const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_voice_assistant";
const DEFAULT_PASSWORD = "Parent@123";

const parentEmails = [
  "parent1@gmail.com",
  "parent2@gmail.com",
  "parent3@gmail.com",
  "parent4@gmail.com",
  "parent5@gmail.com",
];

const legacyParentEmails = [
  "parent1@sca.com",
  "parent2@sca.com",
  "parent3@sca.com",
  "parent4@sca.com",
  "parent5@sca.com",
];

const seedParents = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    let created = 0;
    let updated = 0;
    let migrated = 0;

    for (let i = 0; i < legacyParentEmails.length; i += 1) {
      const legacyEmail = legacyParentEmails[i];
      const newEmail = parentEmails[i];
      const legacyUser = await User.findOne({ email: legacyEmail });
      const existingNewUser = await User.findOne({ email: newEmail });

      if (legacyUser && !existingNewUser) {
        legacyUser.email = newEmail;
        legacyUser.role = "parent";
        legacyUser.password = hashedPassword;
        await legacyUser.save();
        migrated += 1;
      }
    }

    for (const email of parentEmails) {
      const existing = await User.findOne({ email });

      if (!existing) {
        await User.create({
          email,
          password: hashedPassword,
          role: "parent",
        });
        created += 1;
        continue;
      }

      existing.password = hashedPassword;
      existing.role = "parent";
      await existing.save();
      updated += 1;
    }

    console.log("Parent seeding completed.");
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Migrated from @sca.com: ${migrated}`);
    console.log(`Password for all parent accounts: ${DEFAULT_PASSWORD}`);
    console.log("Emails:");
    parentEmails.forEach((email) => console.log(`- ${email}`));
  } catch (error) {
    console.error("Failed to seed parent accounts:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedParents();
