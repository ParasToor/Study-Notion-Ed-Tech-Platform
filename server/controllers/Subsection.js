const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const uploadImageToCloudinary = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    // data get from req.body
    const { sectionId, title, timeDuration, description } = req.body;

    const video = req.files.videoFile;

    if (!title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const videoCloudinary = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionCreated = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: videoCloudinary.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSections: subSectionCreated._id,
        },
      },
      {
        new: true,
      }
    );
    // log updated section here , after adding populate query

    res.status(200).json({
      success: true,
      message: "Subsection created",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error inside create subSection handler",
      error: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "Require full data",
      });
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      messasge: "SubSection Updated",
      data: updatedSubSection,
    });
  } catch (err) {
    res.status(500).jaon({
      success: false,
      message: "Error inside updateSubSection handler",
      error: err.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const subSectionId = req.body;

    await SubSection.findByIdAndDelete({ _id: subSectionId });
    // Here we need to delete subsection id from Section model

    res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (err) {
    res.status(500).jaon({
      success: false,
      message: "Error inside deleteSubScetion handler",
      error: err.message,
    });
  }
};
