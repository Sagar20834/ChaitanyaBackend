import { Notice } from "../Models/Notice .js";
import cloudinary from "../config/cloudinaryConfig.js";
import { unlink } from "fs/promises";
import appError from "../utils/appError.js";
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

    if (!(title && description && fileUrl && fileType)) {
      return next(appError("All fields are required", 400));
    }

    const file = req.file;

    if (req.file) {
      const folderPath = `notice/${title}`;

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folderPath,
        public_id: title, // Use the product ID as the file name
        overwrite: true, // Ensure that the existing file with the same public_id is overwritten
      });

      // Remove the uploaded file from the server
      await unlink(req.file.path);

      // Update the image URL in the product object
      fileUrl = result.secure_url;
    }

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

    res.json({
      message: "Notice Added  successfully",
      newNotice: newNotice,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({});
    res.status(200).json({
      status: "success",
      notices,
    });
  } catch (error) {
    return next(new appError("Failed to get notices", 500));
  }
};

export { addNotice, getNotices };
