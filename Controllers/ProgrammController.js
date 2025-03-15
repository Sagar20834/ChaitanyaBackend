import mongoose from "mongoose";
import Programm from "../Models/Programm.js";
import appError from "../Utils/appError.js";

const getProgramms = async (req, res, next) => {
  try {
    const programms = await Programm.find({});
    res.status(200).json({
      status: "success",
      programms,
    });
  } catch (error) {
    return next(new appError("Failed to get programms", 500));
  }
};
const getProgrammByUser = async (req, res, next) => {
  try {
    const user = req.user;
    const programms = await Programm.find({ name: user.programm });
    const chapters = programms;

    res.status(200).json({
      chapters,
    });
  } catch (error) {
    return next(appError("Failed to get programms", 500));
  }
};
const getChapterDetailsById = async (req, res, next) => {
  const user = req.user;
  // console.log(user.programm);
  try {
    // const prog = await Programm.find({ name: user.programm });
    // console.log(prog);
    const chapterId = req.params.id;

    // Find the document that contains the chapter with the specified chapter_id
    const programm = await Programm.findOne({
      name: user.programm,
      "chapters.chapter_id": chapterId,
    }).select({
      "chapters.$": 1, // Only return the chapter that matches the query
    });

    if (!programm) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      chapter: programm.chapters[0], // Return the matched chapter
    });
  } catch (error) {
    return next(error); // Handle the error appropriately
  }
};

const updateSubheadingContent = async (req, res, next) => {
  const { programName, sectionId, subheadingTitle } = req.params;
  const { content } = req.body;
  // Check if content is provided
  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    // Find and update the specific subheading content using program name, sectionId, and subheading title
    const programm = await Programm.findOneAndUpdate(
      {
        name: programName, // Find by program name (e.g., Computer Engineering)
        "chapters.sections.section_id": sectionId,
        "chapters.sections.subheadings.title": subheadingTitle,
      },
      {
        $set: {
          "chapters.$[chapter].sections.$[section].subheadings.$[subheading].content":
            content,
        },
      },
      {
        arrayFilters: [
          { "chapter.sections.section_id": sectionId },
          { "section.section_id": sectionId }, // Match the correct section by sectionId
          { "subheading.title": subheadingTitle }, // Match the correct subheading by title
        ],
        new: true,
        multi: false, // Only update one document (the first match)
      }
    );

    if (!programm) {
      return res
        .status(404)
        .json({ message: "Program, Section, or Subheading not found" });
    }

    res
      .status(200)
      .json({ message: "Subheading content updated successfully" });
  } catch (error) {
    console.error("Error updating subheading content: ", error);
    return next(error);
  }
};

export {
  getProgramms,
  getProgrammByUser,
  getChapterDetailsById,
  updateSubheadingContent,
};
