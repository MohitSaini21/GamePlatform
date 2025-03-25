import express from "express"; // Core framework for building the server
import { config } from "dotenv"; // For environment variable management
import ejs from "ejs";
import moment from "moment-timezone";
import cookieParser from "cookie-parser";
import User from "./modal/user.js";
import { userAuthRoute } from "./routes/userAtuh.js";
import { ConnectDB } from "./config/db.js";
import { generateTokenAndSetCookie } from "./utils/createJwtTokenSetCookie.js";
import { checkAuthHome } from "./middleware/checkAuth.js";
import { felxibleAuth } from "./middleware/flexible.js";
// Load Environment Variables
config();

const PORT = process.env.PORT || 5000; // Default to 8000 if PORT is not defined in .env
const app = express();
app.use(cookieParser());
// Middleware and Settings
// Set EJS as the view engine (Corrected 'view engine' typo)
app.set("view engine", "ejs");

// Middlewares for Parsing and Static Files (Optional, Add if Needed)
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static("public")); // Serve static files from the "public" directory

// Public Routes

app.get("/", felxibleAuth, async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user.id);
    return res.render("public/index.ejs", { user });
  }

  return res.render("public/index.ejs");
});

// auth Related
app.get(
  "/signup",
  felxibleAuth,
  (req, res, next) => {
    if (!req.user) {
      return next();
    }
  },
  (req, res) => {
    return res.render("public/signup.ejs");
  }
);
app.post("/signup", async (req, res) => {
  // Destructure the request body
  const { userName, email, password } = req.body;

  try {
    // Create a new user instance
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Send an error response if the user already exists
      return res.status(400).json({
        message: "Error: User already exists",
        success: false,
      });
    }
    const newUser = new User({
      userName,
      email,
      password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a successful response
    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (err) {
    // Handle any errors that occur
    console.error("Error creating user:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});
app.get(
  "/login",
  felxibleAuth,
  (req, res, next) => {
    if (!req.user) {
      return next();
    }
  },
  (req, res) => {
    return res.render("public/login.ejs");
  }
);
app.post("/login", async (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const existingUser = await User.findOne({ email });

    // Check if the user exists
    if (!existingUser) {
      // User not found
      return res.status(401).json({
        message: "Invalid credentials", // Send an error message for invalid credentials
        success: false,
      });
    }

    // Check if the password matches (assuming the passwords are stored as plain text)
    // If you're using hashed passwords, you would need to use bcrypt to compare the password
    if (existingUser.password !== password) {
      // Password does not match
      return res.status(401).json({
        message: "Invalid credentials", // Send an error message for invalid credentials
        success: false,
      });
    }

    // If both email and password are correct, send a success response

    if (generateTokenAndSetCookie(res, existingUser._id)) {
      return res.status(200).json({
        message: "You are logged in", // Send success message
        success: true,
        user: existingUser, // Optionally send user data
      });
    }
  } catch (err) {
    // Handle any errors that occur (database connection, etc.)
    console.error("Error logging in:", err.message);
    return res.status(500).json({
      message: "Server error", // Send server error message
      error: err.message,
      success: false,
    });
  }
});

app.get("/logout", (req, res) => {
  // Clear cookies by name
  res.clearCookie("authToken");
  res.clearCookie("pageLoaded");

  // Redirect the user to the home page
  return res.redirect("/");
});

// API endpoint to get 5 users
app.get("/users", async (req, res) => {
  try {
    // Fetch 5 users from the database
    const users = await User.find().limit(5);

    // Send users as JSON response
    res.status(201).json(users);
  } catch (err) {
    // Send error message if something goes wrong
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});
app.listen(PORT, () => {
  ConnectDB();
});

app.use("/user", checkAuthHome, userAuthRoute);
