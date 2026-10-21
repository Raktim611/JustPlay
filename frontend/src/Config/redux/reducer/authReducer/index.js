import { createSlice } from "@reduxjs/toolkit"
import { addsongtoPlaylist, getAboutUser, getAllPlaylist, getRecentPlays, getSongByname, loginuser, makePlaylist, postRecentPlays, registeruser } from "../../action/authAction"


const initialState={
    user:undefined,
    message:"",
    username:"",
    isError:false,
    isLoggedin:false,
    isRegistered:false,
    isTokenthere:false,
    isLoading:false,
    isSuccess:false,
    song:null,
    allSong:[],
    recentSongs:[],
    
    playlist:[],
}


const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,

    },
    extraReducers:(builder)=>{
        builder
        .addCase(registeruser.rejected,(state,action)=>{
            state.isError=true;
            state.isSuccess=false;
            state.isRegistered=false;
            state.message=action.payload.message||"Invalid Credentials"
        })
        .addCase(registeruser.fulfilled,(state,action)=>{
            state.isSuccess=true;
            state.isError=false;
            state.isRegistered=true;
            state.message="Registration Successful. Now LogIn"
        })
        .addCase(loginuser.rejected,(state,action)=>{
            state.isError=true;
            state.message="Something is wrong"

        })
        .addCase(loginuser.pending,(state,action)=>{
            state.message="Logging You In....";
            state.isError=false;
        })
        .addCase(loginuser.fulfilled,(state,action)=>{
            state.message="User Logged In";
            state.isError=false;
            state.isLoggedin=true
        })
        .addCase(getAboutUser.rejected,(state,action)=>{
            state.isError=true;

        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.user=action.payload;
            state.username=action.payload.username;
        })
        .addCase(getSongByname.rejected,(state,action)=>{
            state.isError=true;
            state.message=action.payload.message||"No song found.";
            state.song=null;
            state.allSong=[];
        })
        .addCase(getSongByname.fulfilled,(state,action)=>{
            state.isError=false;
            state.song=action.payload.song;
            state.allSong=action.payload.allSongs;
            state.message=""
        })
        .addCase(postRecentPlays.rejected,(state,action)=>{
            state.message="Some error Occured";
            state.isError=true;
            
        })
        .addCase(postRecentPlays.fulfilled,(state,action)=>{
            state.message="Recent Plays Updated";
            state.isError=false;
        
        })
        .addCase(getRecentPlays.rejected,(state,action)=>{
            state.message="Something went Wrong",
            state.isError=true;

        })
        .addCase(getRecentPlays.fulfilled,(state,action)=>{
            state.message="Successfully Data Fetched ";
            state.isError=false;
            console.log(action.payload);
            state.recentSongs=action.payload;
        })
        .addCase(makePlaylist.rejected,(state,action)=>{
            state.isError=true;
            state.message="Something went Wrong";
            

        })
        .addCase(makePlaylist.fulfilled,(state,action)=>{
            state.isError=false;
            state.message=action.payload;
            
        })
        .addCase(addsongtoPlaylist.rejected,(state,action)=>{
            state.isError=true;
            state.message="Something went wrong";
        })
        .addCase(addsongtoPlaylist.fulfilled,(state,action)=>{
            state.isError=false;
            state.message="Song Added to Playlist";

        })
        .addCase(getAllPlaylist.rejected,(state,action)=>{
            state.isError=true;
            state.message=action.payload||"Something went wrong"
        })
        .addCase(getAllPlaylist.fulfilled,(state,action)=>{
            state.isError=false;
            state.message="Here You go !!"
            console.log(action.payload);
            state.playlist=action.payload;
        })
        

    }

})

export const {reset}=authSlice.actions;

export default authSlice.reducer;




































