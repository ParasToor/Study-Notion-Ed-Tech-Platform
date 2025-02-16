const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body.email;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status().json({
        success: false,
        message: "Wrong email this email doesn't exists",
      });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link - ${url}`
    );

    return res.json({
      success: true,
      message: "Email sent Successfully, please check email and change pwd",
    });
  } catch (err) {
    console.log("Error inside resetPasswordToken");
    console.error(err);
    return res.json({
      success: false,
      message: "Error inside resetPasswordToken",
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }

    const findUser = await User.findOne({ token });

    if (!findUser) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (findUser.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.log("Error in reset password");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "error inside the resetPassword",
      error: err.message,
    });
  }
};

module.exports = { resetPasswordToken, resetPassword };
