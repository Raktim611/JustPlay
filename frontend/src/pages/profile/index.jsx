import { useDispatch, useSelector } from "react-redux"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react";
import { getAboutUser, makePlaylist } from "@/Config/redux/action/authAction";
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserLayout from "@/Layouts/UserLayout";
import Footer from "@/Components/Footer";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeDown } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { clientServer } from "@/Config";
import { useRouter } from "next/router";
import {FaCross,FaTimes } from "react-icons/fa";
export default function profile(){
    const authState=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const audioRef=useRef();
    const router=useRouter();
    useEffect(()=>{
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
    },[]);
    const [ismodalopen,setIsmodalOpen]=useState(false);
    const [playlistname,setPlaylistName]=useState("");
        const [isPlaying,setIsPlaying]=useState(false);
        const [currentTime,setCurrentTime]=useState(0);
        const [duration,setDuration]=useState(0);
        const [volume ,setVolume]=useState(1);
        const handlePlay=()=>{

    if(isPlaying){
        audioRef.current.pause();
    }else{
        audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
    }
    const formatTime=(time)=>{

    if(!time) return "0:00";

    const minutes=Math.floor(time/60);

    const seconds=Math.floor(time%60);

    return `${minutes}:${
        seconds<10 ? "0"+seconds : seconds
    }`;
    }

    const profilePictureUpdate=async (file)=>{
        try{
            const formdata=new FormData();
            formdata.append("token",localStorage.getItem("token"));
            formdata.append("picture",file,);
            const response=await clientServer.post("/updateProfilePicture",formdata);
            dispatch(getAboutUser({token:localStorage.getItem("token")}));
        }
        catch(err){
            console.log(err);
        }

    }


    return(

        <DashboardLayout>
            <UserLayout>
            
                
                <div className={styles.profileHeader}>

                <div className={styles.leftSection}>
                    <div className={styles.profilePicture}>
                    <img src={authState.user?.profilePicture} />
                    
                    <label htmlFor="updateProfilePicture" className={styles.editBtn}>
                        <FaEdit></FaEdit>
                    </label>

                    <input
                        hidden
                        type="file"
                        id="updateProfilePicture"
                        onChange={(e) => profilePictureUpdate(e.target.files[0])}
                    />
                    </div>

                    <div className={styles.userInfo}>
                    <h1>{authState.user?.name}</h1>
                    <br></br>
                    <h3>Music Lover 🎵</h3>
                    </div>
                </div>
                <button onClick={async ()=>{
                    setIsmodalOpen(true);
                    await dispatch(getAboutUser({token:localStorage.getItem("token")}))
                    }} className={styles.uploadBtn}>
                    Create Playlist
                    
                </button>

                {authState.user?.playlists?.length>0 && 
                        
                            <button onClick={()=>router.push("/playlist")} className={styles.uploadBtn}>
                                Explore Your Playlist
                            </button>
                        
                }

                <button
                    className={styles.uploadBtn}
                    onClick={() => router.push("/contribute")}
                >
                    Upload Song 
                </button >

                </div>
                
                        {ismodalopen && 
                            <div onClick={()=>{
                                setIsmodalOpen(!ismodalopen);
                                setPlaylistName("");
                                }}  className={styles.makeplaylistpopup}>

                                    <div onClick={(e)=>{
                                        e.stopPropagation();
                                    }} className={styles.createPlaylist}>
                                        <div className={styles.cross}>
                                            <FaTimes onClick={()=>{
                                                setIsmodalOpen(!ismodalopen)
                                                setPlaylistName("");
                                                }}></FaTimes>
                                        </div>
                                        <input className={styles.inp} type="text" onChange={(e)=>setPlaylistName(e.target.value)} placeholder="Enter Playlist Name" ></input>
                                        <br></br>
                                        {playlistname &&  <button onClick={(e)=>{
                                            dispatch(makePlaylist({token:localStorage.getItem("token"),playlistname:playlistname}));
                                            setIsmodalOpen(!ismodalopen);
                                            setPlaylistName("");
                                        }} className={styles.playlistcreate}>
                                            Create
                                        </button>}
                                    </div>

                            </div>
                        }
                    
                    
            
                <Footer>
                    {authState.song && 
                        <div className={styles.player}>

                        

                     <img src={authState.song?.coverImage} className={styles.cover}/>
                        
                        <div className={styles.info}>
                        <h3>{authState.song?.name}</h3>
                        <p>{authState.song?.artist}</p>
                        </div>

                        <div className={styles.timeline}>

                            <input
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}

                                onChange={(e)=>{
                                    audioRef.current.currentTime=e.target.value;
                                    setCurrentTime(e.target.value);
                                }}
                            />

                                

                            <p>
                                {formatTime(currentTime)} /
                                {formatTime(duration)}
                            </p>

                        </div>
                        <div className={styles.sound}>
                            {volume==0?<FaVolumeMute />:<FaVolumeUp/>}
                            <input className={styles.volumebar} type="range" step={0.01} min={0} max={1} value={volume} onChange={(e)=>{
                                    audioRef.current.volume=e.target.value;
                                    setVolume(e.target.value);
                            }}></input>
                        </div>

                        <audio 
                            onTimeUpdate={()=>{
                            setCurrentTime(audioRef.current.currentTime);
                            }}

                            onLoadedMetadata={()=>{
                            setDuration(audioRef.current.duration);
                            }}  ref={audioRef} src={authState.song?.media}>

                        </audio>

                        <button onClick={handlePlay}>
                             {isPlaying?<FaPause/>:<FaPlay/>}
                        </button>
                        
                     

                       

                </div>}
                </Footer>
            </UserLayout>
        </DashboardLayout>




    )
}
















































