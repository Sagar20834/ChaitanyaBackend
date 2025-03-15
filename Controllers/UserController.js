import User from "../Models/User.js";
import appError from "../Utils/appError.js";
import setToken from "../Utils/setToken.js";
const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobile,
      gender,
      password,
      course,
      confirmPassword,
    } = req.body;

    if (
      !(
        fullName &&
        email &&
        password &&
        confirmPassword &&
        course &&
        gender &&
        mobile
      )
    ) {
      return next(appError("All fields are required", 400));
    }

    if (password !== confirmPassword) {
      return next(appError("Passwords do not match", 400));
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(appError("Email already in use", 400));
    }

    const newUser = await User.create({
      fullName,
      email,
      mobile,
      gender,
      password,
      course,
      confirmPassword,
    });

    res.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError("Email and password are required", 400));
    }
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(appError("Invalid email or password", 401));
    }
    const loggedInUser = await User.findOne({ email }).select("-password");

    const token = setToken(res, loggedInUser._id);
    res.json({
      message: "Logged in successfully",
      token,
      loggedInUser,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    res.json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.university = req.body.university || user.university;
      user.college = req.body.college || user.college;
      user.programm = req.body.programm || user.programm;

      if (req.body.password && req.body.password !== "") {
        user.password = req.body.password;
      }
      const loggedInUser = await user.save();

      const token = setToken(res, loggedInUser._id);

      res.json({
        message: "Logged in successfully",
        token,
        loggedInUser,
      });
    } else {
      return next(appError("User Not Found", 404));
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

export { registerUser, login, logout, updateUserProfile };
