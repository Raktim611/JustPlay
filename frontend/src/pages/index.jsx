import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import TypedText from "@/Components/TypedText/TypedText";


export default function Home() {
  const router=useRouter();


  return (
    <>
     <div className="maincontainer">
      <div className="leftcontainer">
        <div className="center">
              <h1>Welcome to JustPlay</h1>
              <br></br>
              <br></br>

        {/* <div className="content">
          <h2>A True Music Streaming Platform</h2>
          <br></br>
          <h2>Listen music free of cost</h2>
          <br></br>
          <h2>Feel the rhythm</h2>
        </div> */}

        <span className="introduction">
          <TypedText strings={[
            'A True Music <span class="rose">Platform</span>',
            'Feel every <span class="pink">beat</span>',
            'Discover your <span class="purple">vibe</span>',
            'Music for every <span class="mint">mood</span>',
          ]} />
        </span>

        <div onClick={()=>{
          router.push("/login")
        }} className="button">
          <p>Explore</p>
        </div>
        
        </div>
      </div>


      <div className="rightContainer">
        <div className="rightContainerImage">
         <Image src="/Headphones.avif" alt="Photo" height={600} width={700}></Image>
        </div>
      </div>
     </div>
    </>
  )
}
