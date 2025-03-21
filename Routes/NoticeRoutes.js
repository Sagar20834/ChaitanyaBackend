import express from "express";

import isLoggedIn from "../Middlewares/isLoggedIn.js";
import {
  addNotice,
  deleteNotice,
  getNoticeById,
  getNotices,
  updateNotice,
} from "../Controllers/NoticeController.js";
import isAdmin from "../Middlewares/isAdmin.js";
import multer from "multer";

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const noticeRouter = express.Router();
noticeRouter.post(
  "/addnotice",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  addNotice
);
noticeRouter.get("/allnotice", getNotices);
noticeRouter.get("/notice/:id", getNoticeById);
noticeRouter.post(
  "/editnotice/:id",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  updateNotice
);
noticeRouter.delete("/deletenotice/:id", isLoggedIn, isAdmin, deleteNotice);

export default noticeRouter;
