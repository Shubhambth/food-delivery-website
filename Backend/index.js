import express from "express"
import dotenv from "dotenv"

dotenv.config();

import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes..js";
import cors from "cors"



const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/auth",authRouter)
const PORT = process.env.PORT

connectDB();

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
