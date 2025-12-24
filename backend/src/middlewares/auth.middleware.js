import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import dotenv from "dotenv"

dotenv.config();

export const verifyJWT = asyncHandler(async(req , res , next)=>{
    const token = req.cookies?.accessToken 

    if(!token){
        throw new ApiError(404 , "access code not found / unauthorized req")
    }

    const decodedToken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET )

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(405 , "user not found in the auth middleware")
    }

    req.user = user
    next()
})