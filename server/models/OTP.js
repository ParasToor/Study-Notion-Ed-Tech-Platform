const mongooose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

async function sendVerificationEmail(email, otp) {
  try {
    const response = mailSender(
      email,
      "Verification Email from Study Notion",
      otp
    );
    console.log("Email sent successfully with response - ", response);
  } catch (err) {
    console.error(err);
    console.log(
      "Error occured in sendVerificationEmail function placed in OTP model"
    );
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
