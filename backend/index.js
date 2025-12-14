import express from "express"
import postRouter from "./routes/post.route.js"
import connectDB from "./lib/connectDB.js"
import cors from "cors"
import dotenv from 'dotenv';
import { startScheduler } from "./scheduler.js";

dotenv.config({ path: '.env' })

const app = express();

app.use(cors(process.env.CLIENT_URL))
app.use(express.json())

// app.get("/test",(req,res)=>{
//     res.status(200).send("it works!")
// })

app.use("/posts", postRouter);

app.use((error,req,res,next)=>{

    res.status(error.status || 500);

    res.json({
        message:error.message || "Something went wrong!",
        status: error.status,
        stack: error.stack
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0",()=>{
    connectDB();
    console.log("Server is running!")
    console.log("API on", PORT)

    startScheduler();
})