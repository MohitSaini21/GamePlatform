import express from "express";
import User from "../modal/user.js";
const router = express.Router();

router.get("/feedBack", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    return res.render("authorized/feedBack.ejs", { user });
  } else {
    return res.render("authorized/feedBack.ejs");
  }
});
// Import Mongoose

// Route to handle feedback
router.post("/feedBack", async (req, res) => {
  try {
    const { id } = req.user; // Assuming the user ID is available in req.user
    const { feedBack } = req.body; // Get feedback from the request body
    console.log(feedBack)

    // Find the user by ID and update the feedback field
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Update the feedback field of the user
    user.feedBack = feedBack; // Set the feedback

    // Save the updated user document
    await user.save();

    // Return a success response
    return res.status(201).json({
      message: "Everything is working perfectly. Feedback saved successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
});

router.get("/games/TTT", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    return res.render("authorized/TTT.ejs", { user });
  } else {
    return res.render("authorized/TTT.ejs");
  }
});
router.get("/games/RPS", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    return res.render("authorized/RPS.ejs", { user });
  } else {
    return res.render("authorized/RPS.ejs");
  }
});
router.get("/games/RC", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    return res.render("authorized/RC.ejs", { user });
  } else {
    return res.render("authorized/RC.ejs");
  }
});
export const userAuthRoute = router;
