import mongoose from "mongoose";
import dotenv from "dotenv";
// Import your User model from Step 1
import User from "../models/user.model";

dotenv.config();

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected for migration");

    // Use updateMany to rename the field for all documents
    const result = await User.updateMany(
      {}, // Filter: empty object matches all documents
      { $rename: { name: "username" } }, // Update: rename 'name' to 'username'
      { strict: false } // Options: 'multi: true' is default for updateMany, 'strict: false' might be needed if the old field wasn't in the schema
    );

    console.log(
      `Migration complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
    );

    // Disconnect after migration
    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigration();