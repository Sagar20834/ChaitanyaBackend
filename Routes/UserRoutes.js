import express from "express";
import {
  login,
  logout,
  registerUser,
  updateUserProfile,
} from "../Controllers/UserController.js";

import isLoggedIn from "../Middlewares/isLoggedIn.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.put("/profile", isLoggedIn, updateUserProfile);
userRouter.post("/logout", logout);

export default userRouter;
