import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { genToken } from "../utils/token.js";

export const signUp = async (req,res) => {
    try {
        const {fullName , email , password , mobile , role} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"the user already exist"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"password must be atleast 6 character long"});

        }

        if(mobile.length<10){
            return res.status(400).json({message:"the mobile number should be al least 10 digits long"});

        }

        const hashedPassword = await bcrypt.hash(password,10);

        user = await User.create({
            fullName, email , mobile , role , password:hashedPassword
        })

        const token = await genToken(user._id);

        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })

        return res.status(2001).json({message:"user created",user})


    } catch (error) {
        return res.status(500).json(error)
    }
}


export const signIn = async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await User.fineOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist"})

        }
        
        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.status(400).json({message:"incorrect Password"})
        }

        const token = await genToken(user._id)

        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge: 7*24*60*60*1000,
            httpOnly:true
        })

        return res.status(200).json({message : "user found",user})

    } catch (error) {
        return res.status(500).json(`sign In error ${error}`)
    }
}

export const signOut = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        return res.status(500).json({message:`sign out error ${error}`})
    }
}