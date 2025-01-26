const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: 'OTP for email verification',
        text: `Welcome to SkillVault. Your OTP is ${otp}`
    }
    try{
        await transporter.sendMail(mailOptions);
    } catch(err){
        console.log("Error sending email: ",err);
        throw new Error('Failed to send OPT');
    }
}

module.exports = {sendOTPEmail};