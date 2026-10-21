const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
const userRouter=require("./routes/userroute.js");
const postRoute=require("./routes/postroute.js");
const app=express();

dotenv.config();

const port=8080;

app.use(cors());
app.use(express.json());


app.use(userRouter);
app.use(postRoute);

const connect=async ()=>{
    await mongoose.connect(process.env.mongo_url);
}

connect()
.then(()=>console.log("Connected to DB : )"))
.catch((err)=>console.log("Not connected ",err));





app.listen(port,()=>{
    console.log(`App is listening to port ${port}`);
})


























































