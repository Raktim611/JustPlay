import { useDispatch, useSelector } from "react-redux"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react";
import { getAboutUser, getAllPlaylist } from "@/Config/redux/action/authAction";
import Footer from "@/Components/Footer";
import UserLayout from "@/Layouts/UserLayout";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useRouter } from "next/router";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
export default function playlist(){
        const authState=useSelector((state)=>state.auth);
        const dispatch=useDispatch();
        const audioRef=useRef();
        const router=useRouter();
        useEffect(()=>{
            dispatch(getAboutUser({token:localStorage.getItem("token")}));
        },[]);
        
            const [isPlaying,setIsPlaying]=useState(false);
            const [currentTime,setCurrentTime]=useState(0);
            const [duration,setDuration]=useState(0);
            const [volume ,setVolume]=useState(.5);
            const [currentSong,setCurrentSong]=useState(null);
            const [songs,setSongs]=useState([]);
            const [hasUserInteracted, setHasUserInteracted] = useState(false);

        const playNextSong=()=>{

                const currentIndex=songs.findIndex(
                    (song)=>song._id===currentSong._id
                );

                const nextSong=songs[currentIndex+1];

                if(nextSong){
                    setCurrentSong(nextSong);
                }
        }
        useEffect(()=>{
        if(currentSong && audioRef.current && hasUserInteracted){
            audioRef.current.play();
            setIsPlaying(true);
        }
        },[currentSong]);


         const handlePlay = async () => {
        if (!audioRef.current || !currentSong) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
                setHasUserInteracted(true); 
            }
        } catch (err) {
            console.log(err);
        }
    };

        const formatTime=(time)=>{
    
        if(!time) return "0:00";
    
        const minutes=Math.floor(time/60);
    
        const seconds=Math.floor(time%60);
    
        return `${minutes}:${
            seconds<10 ? "0"+seconds : seconds
        }`;
        }

    useEffect(()=>{
        if(authState.playlist?.songs?.length > 0){
            setSongs(authState.playlist.songs);
            setCurrentSong(authState.playlist.songs[0]);
        }
    },[authState.playlist]);


    useEffect(()=>{
        if(authState.user?.playlists?.length>0){
            console.log("Playlist Calling");
             dispatch(getAllPlaylist({playlistId:authState.user.playlists[0]}));
        }
        
        
    },[authState.user]);

    if(!authState.user){
        return(
           <DashboardLayout>
            <UserLayout>
                 <div>
                    <h2>Loading......</h2>
                </div>  
            </UserLayout>
           </DashboardLayout>
        )
    }
    else{
        return(
       <DashboardLayout>
        <UserLayout>
            <div className={styles.playlist}>
            <div className={styles.description}>
                <div className={styles.profilepicture}>
                   {authState.playlist?.owner?.profilePicture && (
                        <img 
                            // src={authState.playlist.owner.profilePicture} 
                            src={authState.playlist.songs[0].coverImage} 
                            alt="Profile Picture" 
                        />
                    )}
                   
                </div>
                <div className={styles.information}>
                    <h4><i>Private Playlist</i></h4>
                    <h1><i>{authState.playlist.playlistname}</i></h1>
                </div>
            </div>
            <div className={styles.playlistSongs}>
                <h2 style={{marginBottom:"20px"}}><i>Songs in your Playlist</i></h2>
                    {songs && 
                        songs.map((song,idx)=>{
                            return(
                                <div onClick={()=>setCurrentSong(song)} key={idx} className={styles.individualsong}>
                                    <img src={song.coverImage}></img>
                                    <div className={styles.info}>
                                        <h2>{song.name}</h2>
                                        
                                    </div>
                                    <h3 style={{marginRight:"30px"}}>{song.artist}</h3>
                                </div>
                            )
                        })
                    }
            </div>
            
        
                <Footer>
                <div className={styles.footer}>
                
                {!currentSong?(<h2>No Song Found</h2>): 
                (<div className={styles.player}>

                        

                     <img src={currentSong?.coverImage} className={styles.cover}/>
                        
                        <div className={styles.info}>
                        <h3>{currentSong?.name.toUpperCase()}</h3>
                        <p>{currentSong?.artist}</p>
                                              
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
                            
                            }
                            }
                            


                            onLoadedMetadata={()=>{
                            setDuration(audioRef.current.duration);
                            }}  ref={audioRef} src={currentSong?.media}
                            
                            

                             onEnded={playNextSong}

                            >

                        </audio>

                        <button onClick={handlePlay}>
                             {isPlaying?<FaPause/>:<FaPlay/>}
                        </button>
                        
                     

                       

                </div>)
            }

                </div>
            </Footer>
            </div>
        </UserLayout>
       </DashboardLayout>
    )
    }
}