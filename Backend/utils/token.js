import jwt from "jsonwebtoken"

export const genToken = async (userId) => {
    try {
        const token = await jwt.sign(userId,process.env.JWT_SECREAT,{expiresIn:"7d"})
        return token
    } catch (error) {
        console.log(error)
    }
}