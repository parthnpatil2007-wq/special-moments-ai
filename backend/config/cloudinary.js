const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,    // replace with your Cloudinary cloud_name
  api_key: process.env.CLOUD_KEY,        // replace with your Cloudinary api_key
  api_secret: process.env.CLOUD_SECRET   // replace with your Cloudinary api_secret
});

module.exports = cloudinary;
