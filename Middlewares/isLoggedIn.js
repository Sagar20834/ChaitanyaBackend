import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";

const isLoggedIn = async (req, res, next) => {
  let token;
  try {
    token = req.cookies.token;
    if (!token) {
      return next(
        appError(
          "No token,Not logged In, authorization denied IsLoggedIn Middleware",
          401
        )
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(appError("User not found, authorization denied.", 401));
    }

    next();
  } catch (error) {
    console.error(`Error during authentication: ${error.message}`);
    return next(appError("Not authenticated, please login", 401));
  }
};

export default isLoggedIn;
