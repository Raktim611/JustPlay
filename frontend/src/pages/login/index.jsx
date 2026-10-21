import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./index.module.css"
import { loginuser, registeruser } from "@/Config/redux/action/authAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TypedText from "@/Components/TypedText/TypedText";
export default function Login(){

    const router=useRouter();
    const dispatch=useDispatch();

    const [name,setName]=useState("");
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [show,setShow]=useState(false);


    const [isLogin,setIslogin]=useState(false);
    
    const authState=useSelector((state)=>state.auth);

    useEffect(()=>{
        if(authState.isLoggedin){
            router.push("/dashboard");
        }
    },[authState.isLoggedin]);

    

    const handleRegister=()=>{
        
        
         dispatch(registeruser({name,username,email,password}));
    }

    const handleLogin=()=>{
        
         dispatch(loginuser({email,password}));
    }


    return(
        
       <div className={styles.maincontainer}>
        

        <div className={styles.loginContainer}>

            
            <h1>{isLogin?"Welcome Back !!":"Create Account"}</h1>

            <p style={{color:authState.isError?"red":"green"}}>{authState.message}</p>
            <br></br>

            

            {!isLogin && 
                <div className={styles.loginInfo}>
                    <input type="text" placeholder="Enter Name " onChange={(e)=>setName(e.target.value)}></input>
                    <input type="text" placeholder="Enter Username " onChange={(e)=>setUsername(e.target.value)}></input>
                </div>
                
            }
            <div className={styles.essentialInfo}>
                <input type="text" placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)}></input>
                <div className={styles.password}>
                    <input className={styles.userpassword} type={show?"text":"password"} placeholder="Enter your Password" onChange={(e)=>setPassword(e.target.value)}></input>
                    <div className={styles.show} onClick={()=>setShow(!show)}> <FontAwesomeIcon icon={show ? faEyeSlash : faEye} /></div>
                </div>
            </div>

                <div className={styles.submit}
                    onClick={()=>{
                        if(isLogin){
                            handleLogin();
                        }
                        else{
                            handleRegister();
                        }
                    }}
                >
                    <p>{!isLogin?"Sign Up":"Login"}</p>
                </div>


        </div>

        <div className={styles.registerContainer}>
        <h2>{!isLogin?"Already have an account ??":"Don't have an account ??"}</h2>

        <div onClick={()=>setIslogin(!isLogin)} className={styles.rightLogin}>
              <p>{!isLogin?"Log In":"Sign Up"}</p>
        </div>
        </div>

       </div>


    )
}