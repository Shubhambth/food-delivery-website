import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { genToken } from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req,res) => {
    try {
        const {fullName , email , password , mobile , role} = req.body;
        let user = await User.findOne({email});
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

        return res.status(201).json({message:"user created",user})


    } catch (error) {
        return res.status(500).json(error)
    }
}


export const signIn = async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
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

export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user dont exist"})
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp 
        user.otpExpires = Date.now() + 5*60*1000
        user.isOtpVerified = false
        await user.save()

        await sendOtpMail(email,otp)
        return res.status(200).json({message:"Opt sent successfully"})

    } catch (error) {
        return res.status(500).json({message:"Otp sent failed"})
    }
}

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.resetOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
    }

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (!user.isOtpVerified) {
        return res.status(400).json({ message: "OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
};