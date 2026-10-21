import Navbar from "@/Components/Navbar"
import styles from "./index.module.css"
export default function UserLayout({children}){
    return(
        <div className={styles.userLayout}>
             <Navbar/>
            {children}
        </div>
       
        
        
    )
}