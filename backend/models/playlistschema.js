const mongoose=require("mongoose");


const playlistschema=new mongoose.Schema({
    playlistname:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }],
    

})



const Playlist=mongoose.model("Playlist",playlistschema);

module.exports=Playlist;
































































