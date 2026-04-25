import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";


const authRouter = express.Router();


authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/sighout",signOut)


export default authRouter