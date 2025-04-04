import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import DBConnect from "./Config/DBConnect.js";
import userRouter from "./Routes/UserRoutes.js";
import globalErrorHandler from "./Middlewares/globalErrorHandler.js";
import nodemailer from "nodemailer";
const app = express();
import cors from "cors";
import noticeRouter from "./Routes/NoticeRoutes.js";

DBConnect();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chaitanyacoaching.netlify.app"], // Allow multiple origins
    credentials: true, // Allows cookies and other credentials to be sent
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json("API server is Up and Running , this is the API server!");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notice", noticeRouter);

// Error handling middleware
app.use(globalErrorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
