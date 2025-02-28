const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const categoryDetails = await Category.create({ name, description });

    console.log("Category created - ", categoryDetails);

    //returning the response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (err) {
    console.log("Error inside create Category");
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error inside create Category",
      error: err.message,
    });
  }
};

//Handler function to get all the categories
const showAllCategories = async (req, res) => {
  try {
    // Using find function on DataBase simply
    const allCategories = await Category.find(
      {},
      { name: true, descriptiion: true }
    );

    res.status(200).json({
      success: true,
      message: "All categories returned suceessfully",
      allCategories,
    });
  } catch (err) {
    console.log("Error inside show All Categories");
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error inside show All Categories",
      error: err.message,
    });
  }
};

module.exports = { createCategory, showAllCategories };
