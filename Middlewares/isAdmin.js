import User from "../Models/User.js";
import appError from "../Utils/appError.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const isAdmin = user.isAdmin;
    if (!isAdmin) {
      return next(appError("Unauthorized User, You are not admin", 401));
    }
    next();
  } catch (error) {
    return next(appError(error.message, 401));
  }
};

export default isAdmin;
