require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GETFLOW_EMAIL,
    pass: process.env.GETFLOW_APP_PASSWORD,
  },
});

async function sendEmail(otp, receiverEmail) {
  try {
    const info = await transporter.sendMail({
      from: `"GetFlow Team" <${process.env.GETFLOW_EMAIL}>`,
      to: receiverEmail,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b>`,
    });
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (err) {
    console.error("Email error:", err.message);

    return {
      success: false,
      error: "Failed to send email"
    };
  }
}

module.exports = { sendEmail };