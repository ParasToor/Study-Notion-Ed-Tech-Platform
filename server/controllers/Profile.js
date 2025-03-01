const Profile = require("../models/Profile");
const User = require("../models/User");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    if (!gender || !userId || !contactNumber) {
      res.status(400).json({
        success: false,
        message: "All data is required",
      });
    }

    const userDetails = await User.findById(userId);

    const profileId = userDetails.additionalDetails;

    const profileDetails = Profile.findById(profileId);

    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    // const profileDetails = await Profile.findByIdAndUpdate(
    //   { _id: profileId },
    //   {
    //     gender: gender,
    //     dateOfBirth: dateOfBirth,
    //     about: about,
    //     contactNumber: contactNumber,
    //   },
    //   { new: true }
    // );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: profileDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in createProfile handler",
      error: err.message,
    });
  }
};

// deleteAccount

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;

    await Profile.findByIdAndDelete(profileId);
    // TODO : Homework unenroll user from all enrolled courses

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: false,
      message: "account successfully delted",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in createProfile handler",
      error: err.message,
    });
  }
};
