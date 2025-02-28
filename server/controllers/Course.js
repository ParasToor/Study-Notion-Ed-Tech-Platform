const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/imageUploader");

// course creating handler function
const createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thubnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        suuccess: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instrctor details - ", instructorDetails);
    // TODO: Verify that userId and Instructor Details._id are same or different ?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById({ category });
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "category Details not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create and entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update Category schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    conosole.log("Error inside create Course handler");
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error inside create Course handler",
      error: err.message,
    });
  }
};

// Get all courses
const showAllCourses = async (req, res) => {
  try {
    // TODO : Change below statement incrementally
    const allCourses = await Course.find({});

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched succesfully",
      data: allCourses,
    });
  } catch (err) {
    console.log("Error in show all courses handler");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error in show all courses handler",
      error: err.message,
    });
  }
};

module.exports = { createCourse, showAllCourses };
