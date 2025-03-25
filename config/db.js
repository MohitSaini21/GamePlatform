import mongoose from "mongoose";
// import User from "../models/userSchema.js";

const url = "mongodb+srv://mohitsainisaini2680:mohitsaini21@cluster0.wjx3j.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0"

export const ConnectDB = async () => {
  try {
    await mongoose.connect(url);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error in DB connection or index creation:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};
