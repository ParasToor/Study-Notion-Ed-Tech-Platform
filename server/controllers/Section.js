const Course = require("../models/Course");
const Section = require("../models/Section");

//  Create Section
const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: "false",
        message: "Missing properties",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate("courseContent");

    return res.status(200).json({
      success: "true",
      data: newSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error inside create Section handler",
      error: err.message,
    });
  }
};

//  Update Section
const updateSection = async (req, res) => {
  try {
    const { section_id, newSectionName } = req.body;

    if (!section_id || newSectionName) {
      return res.status(400).json({
        success: "false",
        message: "Missing properties",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      section_id,
      {
        sectionName: newSectionName,
      },
      { new: true }
    );

    return res.status(200).json({
      success: "true",
      data: updatedSection,
      message: "Section updated successsfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error inside update Section handler",
      error: err.message,
    });
  }
};

//  Delete Section
const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    await Section.findByIdAndDelete(sectionId);

    // Todo:  Do we need tpo delete entry from course schema
    return res.status(200).json({
      success: "true",
      message: "Section deleted successsfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error inside delete Section handler",
      error: err.message,
    });
  }
};

module.exports = {createSection,updateSection ,deleteSection}
