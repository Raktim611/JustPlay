import { useEffect, useState } from "react"
import styles from "./index.module.css"
import { clientServer } from "@/Config";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { getAboutUser } from "@/Config/redux/action/authAction";
import { toast } from "react-toastify";





export default function contribute(){
    const router=useRouter();
    const dispatch=useDispatch();
    const [name,setName]=useState("");
    const [artist,setartist]=useState("");
    const [category,setCategory]=useState("");
    const [audio,setAudio]=useState(null);
    const [image,setImage]=useState(null);
    const [isDone,setIsdone]=useState(false);
    const [isPending,setIspending]=useState(false);
    const handleUpload=async ()=>{
        try{
            if(!name || !artist || !category ||!audio ||!image){
                 toast.error("All fields are required : ");
                return false;
            }
            const token=localStorage.getItem("token");
            const formdata=new FormData();
            formdata.append("token",token);
            formdata.append("name",name);
            formdata.append("artist",artist);
            formdata.append("category",category);
            formdata.append("audio",audio);
            formdata.append("image",image);
            const response=await clientServer.post("/uploadSong",formdata);

            toast.success("Song Uploaded Successfully : ");
            return true;
            
        }
        catch(err){
            console.log(err);
            toast.error(err.message);
            return false;
        }
    }
    return(
        <div className={styles.contri}>
            <div className={styles.contribution}>

            <h1>Upload any Song</h1>
            
            <input type="text" onChange={(e)=>setName(e.target.value)} placeholder="Enter Song name"></input>
            <input type="text" onChange={(e)=>setartist(e.target.value)} placeholder="Enter Artist Name"></input>
            <input type="text" onChange={(e)=>setCategory(e.target.value)} placeholder="Enter song category"></input>
            
                <label className={styles.fileUpload}>
                    Upload Song
                    <input type="file" onChange={(e)=>setAudio(e.target.files[0])} accept="audio/*" hidden />
                    </label>

                    <label className={styles.fileUpload}>
                    Upload Cover Image
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}  accept="image/*" hidden />
                    </label>
            
               <div className={styles.finalUpload}>
                <div onClick={async ()=>{
                const success=await handleUpload();
    
                if(!success){
                    return;
                }
                setName("");
                setartist("");
                setCategory("");
                setAudio(null);
                setImage(null);
                setIsdone(true);
                
               }} className={styles.submit}>
                <p><i>Upload</i></p>
               </div>
               {isDone &&
                <div onClick={()=>router.push("/profile")} className={styles.done}>
                    <p>Done</p>
                </div>
               }
               </div>
            
            </div>



        </div>
    )
}