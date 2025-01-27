const User = require("../models/User");
const client = require('../config/redisClient');

// function to generate random 4/6 digit otp
const otpGenerator = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const saveOTP = async (email) => {
  try {
    const userToValidate = await User.findOne({ email }).select("user_id");
    if (!userToValidate) {
      throw new Error("Invalid user");
    }
    const userOTP = otpGenerator();
    const expirationTimeInSeconds = 120;
    // store otp in redis with expiration
    await client.set(email, userOTP, "EX", expirationTimeInSeconds);
    // userToValidate.otp = userOTP;
    // await userToValidate.save();
    return userOTP;
  } catch (err) {
    throw new Error("Error saving OTP to Redis");
  }
};

const validateOTP = async (email, otp) => {
  try{
    // get otp from redis
    const storedOTP = await client.get(email);
    if(!storedOTP){
      throw new Error("OTP expired");
    }
    if(storedOTP !== otp){
      throw new Error('Invalid OTP');
    }
    await client.del(email);
    return true;
  } catch(err){
    throw new Error('Error validating OTP');
  }
}

module.exports = { saveOTP, validateOTP };
