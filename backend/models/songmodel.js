const mongoose=require("mongoose");



const songschema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    category:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
        default:"",
    },
    media:{
        type:String,
        required:true,
    }
})



const Song=mongoose.model("Song",songschema);


module.exports=Song;






























