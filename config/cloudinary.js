const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDAINARY_NAME,
    api_key: process.env.CLOUDAINARY_API_KEY,
    api_secret: process.env.CLOUDAINARY_SECERT_KEY
}); 

module.exports = cloudinary;