import jwt from "jsonwebtoken"; // Importing the JWT library to handle JSON Web Token operations

// Middleware function to check if the user is authenticated and prevent access to the home page if logged in
export const checkAuthHome = (req, res, next) => {
  try {
    // Step 1: Get the authentication token from the cookies sent by the client
    const token = req.cookies.authToken;

    // Step 2: If the token is found, verify it
    if (token) {
      // Verify the token using the secret key stored in environment variables
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "Secret String"
      );

      // Step 3: If the token is valid, print the payload (user data) and attach it to the request object
      console.log("Decoded Payload:", decoded); // Printing the payload to the console (for debugging)
      req.user = decoded; // Attach the decoded user data to the request object

      return next();
    }

    return res.redirect("/signup");
  } catch (error) {
    console.error("Authentication error:", error);
    return res.redirect("/signup");
  }
};
