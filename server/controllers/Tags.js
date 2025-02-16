const Tag = require("../models/Tag");

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const tagDetails = await Tag.create({ name, description });

    console.log("Tag created - ", tagDetails);

    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (err) {
    console.log("Error inside create Tag");
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error inside create Tag",
      error: err.message,
    });
  }
};

const showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, descriptiion: true });

    res.status(200).json({
      success: true,
      message: "All tags returned suceessfully",
      allTags,
    });
  } catch (err) {
    console.log("Error inside show All Tags");
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error inside show All Tags",
      error: err.message,
    });
  }
};

module.exports = { createTag, showAllTags };