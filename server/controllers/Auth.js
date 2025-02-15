const User = require("../models/User");
const OTP = require("../models/OTP");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    var otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp generrated - ", otp);

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    // const otpPayload

    const otpBody = await OTP.create({ email, otp });
    console.log("Otp recorded in db as - ", otpBody);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully`,
    });
  } catch (err) {
    console.error(err);
    console.log("Error inside the sendOTP handler");
    return res.status(500).json({
      success: false,
      message: "Error inside the sendOTP handler",
      error: err.message,
    });
  }
};

const signupHandler = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Something is missing from input data",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm password is not matcing",
      });
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "You are already registered",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: `OTP is not found`,
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "The otp is wrong",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const profileData = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileData,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: `User is registered successfully`,
      userData: user,
    });
  } catch (err) {
    console.error(err);
    console.log("Error inside the sendOTP handler");
    return res.status(500).json({
      success: false,
      message: "Error inside the sendOTP handler",
      error: err.message,
    });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    let findUser = await User.findOne({ email }).populate("additionalDetails");

    if (!findUser) {
      return res.status(500).json({
        success: false,
        message: "no user with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const payload = {
      email: findUser.email,
      id: findUser._id,
      role: findUser.role,
    };

    let token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "2h",
    });

    // findUser = findUser.toObject();
    findUser.token = token;
    findUser.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: findUser,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log("Error  inside login  handler");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error  inside login  handler",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "All the fields are required",
      });
    }

    const findUser = await User.findOne({ email });

    let isMatch = await bcrypt.compare(findUser.password, oldPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    findUser.password = hashedPassword;
    findUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    console.log("Error in changePassword Handler");
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error in changePassword Handler",
      error: err.message,
    });
  }
};

module.exports = { sendOTP, signupHandler, loginHandler };