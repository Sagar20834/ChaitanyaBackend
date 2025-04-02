import { Notice } from "../Models/Notice .js";
import cloudinary from "../Config/cloudinaryConfig.js";
import { unlink } from "fs/promises";
import appError from "../Utils/appError.js";
const addNotice = async (req, res, next) => {
  try {
    let {
      title,
      description,
      fileUrl,
      fileType,
      createdAt,
      updatedAt,
      author,
      previewInSiteOpen,
    } = req.body;

    if (!(title && description && fileType)) {
      return next(appError("All fields are required", 400));
    }
    if (req.file) {
      const folderPath = `notice/${title.trim()}`;

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folderPath,
        public_id: title.trim(),
        overwrite: true,
      });
      await unlink(req.file.path);
      fileUrl = result.secure_url;
    }
    author = req.user._id;
    const newNotice = await Notice.create({
      title,
      description,
      fileUrl,
      fileType,
      createdAt,
      updatedAt,
      author,
      previewInSiteOpen,
    });

    res.status(200).json({
      status: "success",
      message: "Notice Added  successfully",
      newNotice: newNotice,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate({
        path: "author",
        select: "fullName email isAdmin",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      notice,
    });
  } catch (error) {
    return next(new appError("Failed to get notices", 500));
  }
};
const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({})
      .populate({
        path: "author",
        select: "fullName email isAdmin",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      notices,
    });
  } catch (error) {
    return next(new appError("Failed to get notices", 500));
  }
};

const updateNotice = async (req, res, next) => {
  try {
    var { title, description, fileUrl, fileType } = req.body;
    let updatedData = { title, description, fileType };
    if (req.file) {
      const folderPath = `notice/${title.trim()}`;

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folderPath,
        public_id: title.trim(),
        overwrite: true,
      });

      await unlink(req.file.path);

      fileUrl = result.secure_url;
      updatedData.fileUrl = fileUrl;
    } else if (fileUrl) {
      updatedData.fileUrl = fileUrl;
    }

    const notice = await Notice.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return next(new appError("Notice not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Notice updated successfully",
      updatedNotice: notice,
    });
  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return next(new appError("Notice not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Notice deleted successfully",
    });
  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

export { addNotice, getNotices, getNoticeById, updateNotice, deleteNotice };
