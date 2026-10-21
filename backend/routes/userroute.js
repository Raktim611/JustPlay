const User=require("../models/usermodel.js");
const dotenv=require("dotenv");
const express=require("express");
const router=express.Router();
dotenv.config();

const {register,login,updateProfilePicure,makePlaylist,getSong,addSongToPlaylist,getAllPlaylistSongs,getaboutUser,postRecentPlays,getRecentPlays}= require("../controllers/usercontroller.js");

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
        folder: "images",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({storage});


router.route("/updateProfilePicture").post(upload.single("picture"),updateProfilePicure);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/makePlaylist").post(makePlaylist);
router.route("/getSong").get(getSong);
router.route("/postRecentPlays").post(postRecentPlays);
router.route("/getRecentPlays").get(getRecentPlays);
router.route("/playlists/:playlistId/songs").post(addSongToPlaylist);
router.route("/playlists/:playlistId/songs").get(getAllPlaylistSongs);
router.route("/getAboutUser").get(getaboutUser);





module.exports=router;












































