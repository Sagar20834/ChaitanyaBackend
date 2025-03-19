import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Store file URL (PDF/Image)
  fileType: { type: String, enum: ["pdf", "image"], required: true }, // Define type
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  previewInSiteOpen: { type: Boolean, default: false },
});

export const Notice = mongoose.model("Notice", noticeSchema);
