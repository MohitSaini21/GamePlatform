import mongoose from "mongoose";
// import User from "../models/userSchema.js";

const url = "mongodb+srv://sm00976849:OaGWplGlGF75hZU6@cluster0.jer9k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0; // MongoDB URL from environment variable"

export const ConnectDB = async () => {
  try {
    await mongoose.connect(url);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error in DB connection or index creation:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};
