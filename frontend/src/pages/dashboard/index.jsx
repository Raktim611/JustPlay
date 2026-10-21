import Footer from "@/Components/Footer";
import { addsongtoPlaylist, getAboutUser, getRecentPlays, postRecentPlays } from "@/Config/redux/action/authAction";
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserLayout from "@/Layouts/UserLayout";
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css"
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeDown } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import { toast } from "react-toastify";



export default function dashboard(){
    const router=useRouter();
    const authState=useSelector((state)=>state.auth);
    const dispatch=useDispatch();   
    const audioRef=useRef();
    const [isPlaying,setIsPlaying]=useState(false);
    const [currentTime,setCurrentTime]=useState(0);
    const [duration,setDuration]=useState(0);
    const [volume ,setVolume]=useState(.5);
    const [currentSong,setCurrentSong]=useState(null);
    const [songs,setSongs]=useState([]);
    
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
    if(authState.allSong && authState.song){
        setSongs(authState.allSong);
        setCurrentSong(authState.song);
    }
    },[authState.allSong,authState.song]);

    useEffect(()=>{
    if(currentSong && audioRef.current){
        audioRef.current.play();
        setIsPlaying(true);
    }
    },[currentSong]);

    const [hasLogged, setHasLogged] = useState(false);

    useEffect(() => {
    setHasLogged(false);
    }, [currentSong]);

    

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

   useEffect(()=>{
        const TOKEN=localStorage.getItem("token");
        
        if(!TOKEN){
        router.push("/login");
        }
   },[]);

   
    useEffect(()=>{
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
    },[]);
    useEffect(() => {
    dispatch(getRecentPlays({token:localStorage.getItem("token")}));
    },[]);





    
    return(
        <DashboardLayout>
            <UserLayout>
            
            <div className={styles.dashboardContainer}>
                <div className={styles.left}>
                    <div className={styles.lefttop}>
                        {authState.recentSongs.length==0 && <h2>No Recently Played Song</h2>} 
                        {authState.recentSongs.length!=0 && <h2>Recently Played Songs</h2>}
                        
                    </div>
                    <div className={styles.leftbottom}>
                        {authState.recentSongs && authState.recentSongs.map((song,idx)=>{
                            return(
                                <div key={idx} className={styles.recentsongs}>
                                    <img src={song.coverImage}></img>
                                    <h4>{song.name}</h4>

                                </div>
                            )
                        })}
                    </div>
                        
                </div>

                <div className={styles.right}>
                    {authState.allSong.length==0 && <h2>Try Searching Songs to get Started</h2>}   
                    {authState.allSong?.length!=0 && <h2>Here are some Related Songs !!</h2>}
                    
                    {authState.allSong && 
                        authState.allSong.slice(0,8).map((song,idx)=>{
                            return(
                                <div onClick={()=>setCurrentSong(song)}  key={idx} className={styles.sidePlayer}>
                                    <img src={song.coverImage}></img>
                                    <h2 >{song.name.toUpperCase()}</h2>
                                </div>
                            )
                        })
                    }
                        
                </div>

            </div>
                
            
            </UserLayout>
            <Footer>
                <div className={styles.footer}>
                {/* {authState.song==null && <h2>No Song Found</h2>} */}
                {currentSong && 
                <div className={styles.player}>

                        

                     <img src={currentSong?.coverImage} className={styles.cover}/>
                        
                        <div className={styles.info}>
                        <h3>{currentSong?.name.toUpperCase()}</h3>
                        <p>{currentSong?.artist}</p>
                                              
                        </div>
                        <div className={styles.addtoPlaylist}>
                            {authState.user?.playlists?.length>0 && (
                                    <button onClick={()=>{
                                        console.log("Clicked")
                                        dispatch(addsongtoPlaylist({songId:currentSong._id,playlistId:authState.user.playlists[0]}))
                                        .unwrap()
                                        .then((res)=>toast.success(res.message,{
                                            className:"my-container-success",
                                            position:"bottom-center",
                                            
                                            autoClose: 2000,
                                            hideProgressBar: false,
                                        }))
                                        .catch((err)=>toast.error(err.message,{
                                            className:"my-container-error",
                                             position:"bottom-center",
                                            
                                            autoClose: 2000,
                                            hideProgressBar: false,
                                        }));
                                    }}>Add to Playlist</button>
                                )}
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
                            if (!hasLogged && audioRef.current.currentTime >0) {
                                    dispatch(postRecentPlays({
                                        token: localStorage.getItem("token"),
                                        songId: currentSong._id
                                    }));
                                    setHasLogged(true);
                                    
                                }
                            }}
                            


                            onLoadedMetadata={()=>{
                            setDuration(audioRef.current.duration);
                            }}  ref={audioRef} src={currentSong?.media}
                            
                            

                             onEnded={playNextSong}

                            >

                        </audio>

                        <button onClick={handlePlay}>
                             {isPlaying?<FaPause/>:<FaPlay/>}
                        </button>
                        
                     

                       

                </div>}

                </div>
            </Footer>
        </DashboardLayout>
    )
}