const otpModel = require('../models/otp.model');
const bcrypt = require("bcrypt");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


async function saveOtp(email, otp) {

  await otpModel.upsert({
    email,
    otp : otp.toString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  return { success: true };
}

async function varifyOtp(email, otp) {
  const record = await otpModel.findOne({ where: { email } });

  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  if (new Date() > record.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  if (otp!=record.otp) {
    throw new Error("Invalid or expired OTP");
  }

  await otpModel.destroy({ where: { email } });
  console.log("varified");
  return { success: true };
}

module.exports = { saveOtp, generateOtp, varifyOtp };