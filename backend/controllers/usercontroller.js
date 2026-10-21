const express=require("express");
const bcrypt=require("bcrypt");
const User=require("../models/usermodel.js");
const Playlist=require("../models/playlistschema.js");
const Song=require("../models/songmodel.js");
const crypto=require("crypto");

const register=async (req,res)=>{

    const {name,username,email,password}=req.body;
    try{
            if(!name || !username || !email ||!password){
        return res.status(400).json({message:"All fields are required"});
        }

    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({message:"User Already Exists : "});
    }

    const hashedpassword=await bcrypt.hash(password,10);

    const newUser=new User({name,username,email,password:hashedpassword});

    await newUser.save();

    return res.status(200).json({message:"User Created Successfully "});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }


}
const login=async (req,res)=>{
    const {email,password}=req.body;

    try{
        if(!email || !password){
            return res.status(500).json({message:"Invalid Credentials "});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User doesnot exists : "});
        }

        const compassword=await bcrypt.compare(password,user.password);
        const token=crypto.randomBytes(32).toString("hex");
        if(!compassword){
            return res.status(401).json({message:"Wrong Credentials"});
        }
        user.token=token;
        await user.save();
        return res.status(200).json({token});


    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}


const getaboutUser=async(req,res)=>{
    const {token}=req.query;

   try{
     const user=await User.findOne({token}).select("-password -email");
    if(!user){
        return res.status(404).json({message:"User not found "});
    }

    return res.status(200).json(user);

   }
   catch(err){
    return res.status(500).json({message:err.message});
   }
    



}



const updateProfilePicure=async (req,res)=>{

    const {token}=req.body;
    const profilePicture=req.file.path;

    try{
        const user=await User.findOne({token});
        if(!user){
        return res.status(404).json({message:"User does not exist "});
        }

        if(!profilePicture){
            return res.status(400).json({message:"No profile picture Uploaded"});
        }
        user.profilePicture=profilePicture;

        await user.save();

        return res.status(200).json({message:"Profile Picture Updated : "});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }

}


const getSong=async (req,res)=>{
    
    const {songname}=req.query;
    try{
        
        const actualSongname=songname.trim().toLowerCase();

        if(!actualSongname){
            return res.status(400).json({message:"Songname is required "});
        }
        
        const song=await Song.findOne({
                name:{
                    $regex:actualSongname,
                    $options:"i"
                    }
                }).populate("owner","name username");

        if(!song){
            return res.status(404).json({message:"Song not found "});
        }

        const allSongs=await Song.find({category:song.category}).populate("owner","name username");

        return res.status(200).json({song,allSongs});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

const postRecentPlays=async (req,res)=>{
    const {token,songId}=req.body;
    
    try{
        if(!token || !songId){
            return res.status(400).json({message:"Invalid Credentials : ) "});
        }
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found : ) "});

        }

        user.recentlyPlayed=user.recentlyPlayed.filter((id)=>{
            return id.toString()!==songId.toString();
        });
        user.recentlyPlayed.unshift(songId);

        user.recentlyPlayed=user.recentlyPlayed.slice(0,20);

        await user.save();
        return res.status(200).json({message:"Recently Played Updated "});




    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

const getRecentPlays=async (req,res)=>{
    const {token}=req.query;
    try{
        if(!token){
            return res.status(400).json({message:"Invalid credentials "});
        }
        const user=await User.findOne({token}).populate("recentlyPlayed","owner category name artist coverImage media");
        if(!user){
            return res.status(404).json({message:"User no found "});
        }

        return res.status(200).json(user.recentlyPlayed);


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

const makePlaylist=async (req,res)=>{
    const {token,playlistname}=req.body;
    

    try{

        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found "});
        }

        const existingplaylist=await Playlist.findOne({playlistname,owner:user._id});

        if(existingplaylist){
            return res.status(400).json({message:"Already Playlist Exists"});
        }

        const newPlaylist=await Playlist({
            playlistname,
            owner:user._id
        })

        
        await user.playlists.push(newPlaylist._id);
        await newPlaylist.save();
        await user.save();

        return res.status(200).json({message:"Playlist made successfully "});



    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



const addSongToPlaylist=async (req,res)=>{
  const { playlistId } = req.params;
  const { songId } = req.body;
  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }

  try {
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist){
      return res.status(404).json({ message: "Playlist not found" });
    }

   
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

   
    if (playlist.songs.some(id => id.toString() === songId)) {
    return res.status(400).json({ message: "Song already in playlist" });
    }

    
    playlist.songs.push(songId);
    await playlist.save();

    


    return res.status(200).json({message:"Added to Playlist"});
      
      
    

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}



const getAllPlaylistSongs=async(req,res)=>{

    try{
        const {playlistId}=req.params;

        const playlist=await Playlist.findById(playlistId).populate("songs","category name artist coverImage media");
         if(!playlist){
            return res.status(404).json({messahe:"No playlist found "});

        }


        // res.set("Cache-Control", "no-store");
        await playlist.populate("owner","name username email profilePicture");

       
        

        return res.status(200).json(playlist);

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}








module.exports={register,login,updateProfilePicure,makePlaylist,getSong,addSongToPlaylist,getAllPlaylistSongs,getaboutUser,postRecentPlays,getRecentPlays};








































































