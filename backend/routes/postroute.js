const User=require("../models/usermodel.js");
const dotenv=require("dotenv");
const express=require("express");
const router=express.Router();

const {postSong}=require("../controllers/postcontroller.js");
dotenv.config();

const {register,login,updateProfilePicure}= require("../controllers/usercontroller.js");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "songs",
       resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg","mp3","mp4"]
    }
});

const upload = multer({storage,limits: {
    fileSize: 50 * 1024 * 1024, 
  },});


router.route("/uploadSong").post(upload.fields([{name:"audio",maxCount:1},{name:"image",maxCount:1}]),postSong);

module.exports=router;






























