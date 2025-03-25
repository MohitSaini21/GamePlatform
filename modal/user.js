// Import Mongoose
import mongoose from "mongoose";

// Define a Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    feedBack: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true, // This ensures the email is unique in the database
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a Model
const User = mongoose.model("User", userSchema);

// Export the model so it can be used elsewhere
export default User;
