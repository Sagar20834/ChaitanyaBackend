import jwt from "jsonwebtoken";

const setToken = (res, userFoundId) => {
  try {
    // Parse JWT_EXPIRES_IN as days or a time string (e.g., '7d')
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d"; // Default to '7d' if not set

    // Generate the JWT token with the same expiration
    const token = jwt.sign({ id: userFoundId }, process.env.JWT_SECRET_KEY, {
      expiresIn, // Ensure this matches the cookie expiration duration
    });

    // Calculate cookie expiration time based on JWT_EXPIRES_IN
    const days = parseInt(expiresIn) || 7; // Extract numeric days if possible
    const cookieExpirationTime = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const expirationDate = new Date(Date.now() + cookieExpirationTime);

    // Cookie options
    const options = {
      expires: expirationDate, // Sync with token expiration
      httpOnly: true, // Secure cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "None", // Allow cross-site requests
    };

    // Set the token in a cookie
    res.cookie("token", token, options);

    return token; // Optionally return the token
  } catch (error) {
    console.error("Error during token generation:", error);
    throw new Error("Token generation failed.");
  }
};

export default setToken;
