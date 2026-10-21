const mongoose=require("mongoose");


const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        unique:true
    },
    profilePicture:{
        type:String,
        default:"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
    playlists:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Playlist",
    }],
    recentlyPlayed:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }],
    
    token:{
        type:String,
        
    }
})


const User=mongoose.model("User",userschema);

module.exports=User;











































































