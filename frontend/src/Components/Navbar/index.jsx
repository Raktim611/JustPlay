import { useDispatch, useSelector } from "react-redux"
import styles from "./index.module.css"
import { useEffect, useState } from "react";
import { getAboutUser, getSongByname } from "@/Config/redux/action/authAction";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";

export default function Navbar(){

const authState=useSelector((state)=>state.auth);
const router=useRouter();
const dispatch=useDispatch();
const [songname,setSongname]=useState();
useEffect(()=>{
    dispatch(getAboutUser({token:localStorage.getItem("token")}));
},[]);

const handleSearch=()=>{
    dispatch(getSongByname(songname));
}



  if(authState.user){
      return(
        <div className={styles.navbar}>
            <div className={styles.left}>
                <h3 style={{cursor:"pointer",fontSize:"25px"}}  onClick={()=>router.push("/dashboard")}>JustPlay</h3>
                <div className={styles.music}>
                <input className={styles.inputfield} onChange={(e)=>setSongname(e.target.value)} type="text" placeholder="Search Songs..."></input>
                {songname && <button onClick={()=>{
                    handleSearch();

                    
                }} className={styles.findBtn}>
                    
                    <FaSearch></FaSearch>
                        
                    </button>}

                </div>
            </div>
            
            <div className={styles.right}>
                <div onClick={()=>{
                    router.push("/profile");
                }} className={styles.profile}>
                    <img src={authState.user.profilePicture} ></img>
                   
                </div>
                
            </div>
        </div>
      )
  }
  else{
    return(
        <h2>Loading.....</h2>
    )
  }


}