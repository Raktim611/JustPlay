const express=require("express");
const Song=require("../models/songmodel.js");
const User=require("../models/usermodel.js");


const postSong=async (req,res)=>{
    
    try{
        const {token,name,artist,category}=req.body;
        
       
        
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found "});
        }
        if (!name || !artist) {
        return res.status(400).json({ message: "Name and artist required" });
        }
        const actualname=name.trim().toLowerCase();
        
        if (!req.files || !req.files.audio || !req.files.image) {
            return res.status(400).json({
                message: "Audio and image are required"
            });
        }
        const coverImage=req.files.image[0].path;
        const media=req.files.audio[0].path;

        const song=await Song.findOne({name:actualname});
        if(!media){
            return res.status(400).json({message:"Audio File is required "});
        }
        if(song){
            return res.status(400).json({message:"Already There : "});
        }
        const newSong=new Song({
            name:actualname,
            artist,
            coverImage,
            media,
            category,
            owner:user._id
        })

        await newSong.save();

        return res.status(200).json({message:"Song Uploaded"});


    }catch(err){
        console.log(err);
        return res.status(500).json({message:err.message});
    }
}





module.exports={postSong};






























































































