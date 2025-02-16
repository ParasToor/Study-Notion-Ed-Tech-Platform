const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token in missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_KEY);
      console.log("decoded token - ", decode);
      req.user = decode;
    } catch (err) {
      res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }

    next();
  } catch (err) {
    console.log("Error inside the auth middleware");
    console.error(err);
    return res.status(500).json({
      success: flase,
      message: "Error inside the auth middleware",
      eror: err.message,
    });
  }
};

const isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students only",
      });
    }
    next();
  } catch (err) {
    console.log("Error inside isStudent user");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error inside isStudent user",
      error: err.message,
    });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructors only",
      });
    }
    next();
  } catch (err) {
    console.log("Error inside isInstructor user");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error inside isInstructor user",
      error: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (err) {
    console.log("Error inside isAdmin user");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error inside isAdmin user",
      error: err.message,
    });
  }
};

module.exports = { auth, isStudent, isInstructor, isAdmin };