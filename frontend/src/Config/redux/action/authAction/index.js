import { clientServer } from "@/Config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const registeruser=createAsyncThunk(
    "/register",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/register",{
                name:user.name,
                username:user.username,
                email:user.email,
                password:user.password
            })
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const loginuser=createAsyncThunk(
    "/login",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/login",{
                email:user.email,
                password:user.password,
            })

            localStorage.setItem("token",response.data.token);
            return thunkAPI.fulfillWithValue(response.data.token);
            
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getAboutUser=createAsyncThunk(
    "/getAboutUser",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get("/getAboutUser",{
                params:{
                    token:user.token
                }
            })
            return response.data;
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getSongByname=createAsyncThunk(
    "/getSongByName",

    async(songname,thunkAPI)=>{
        try{
            const response =await clientServer.get("/getSong",{
                params:{
                    songname
                }
            })
            
            return response.data;
            
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const postRecentPlays=createAsyncThunk(
    "/recentPlays",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/postRecentPlays",{
                token:user.token,
                songId:user.songId
            })
            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getRecentPlays=createAsyncThunk(
    "/getRecentPlays",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get("/getRecentPlays",{
                params:{
                   token: user.token,
                }
            })
            return response.data;
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)




export const makePlaylist=createAsyncThunk(
    "/makePlaylist",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/makePlaylist",{
                token:user.token,
                playlistname:user.playlistname
            })
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const addsongtoPlaylist=createAsyncThunk(
    "/addsongtoPlaylist",
    async(user,thunkAPI)=>{
        try{
            console.log("API CALL:", `/playlists/${user.playlistId}/songs`);
            const response=await clientServer.post(`/playlists/${user.playlistId}/songs`,{
                songId:user.songId
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getAllPlaylist=createAsyncThunk(
    "/getPlaylist",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get(`/playlists/${user.playlistId}/songs`);
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)














































