import express, { urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoute from "./src/routes/user.route.js";
import postRoute from "./src/routes/post.route.js";
import messageRoute from "./src/routes/message.route.js";
import connectDB from "./src/config/db.js";
dotenv.config();

const app=express();
const port = process.env.PORT || 9000;
app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    });
})


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",    
    credentials: true, 
   }           //access-control-allow-credentials:true
app.use(cors(corsOptions));

// Api here
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.listen(port,()=>{
    connectDB();
    console.log(`server is running on port ${port}`);
});