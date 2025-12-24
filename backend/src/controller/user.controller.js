import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async(req , res , next)=>{

    /*
     * take fullname , email , password from req.body
     * check for any error
     * check if email already exists
     * avatar from req.file
     * check for the avatar
     * create user - entry in db
     * remove password , refresh token from the response
     * check for the user creation
     * return response
    */

    const {fullname , email , password} = req.body;
    console.log(req.body)

    if(!fullname || !email || !password){
        throw new ApiError(400 , "All fields are required");
    }   

    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(401 , "email already exists")
    }

    const avatarLocalPath = req.file?.path || null;


    const user = await User.create({
        fullname,
        email,
        avatar: avatarLocalPath,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500 , "User creation failed")
    }

    return res.status(201).json(
        new ApiResponse(201 , createdUser , "User registered successfully")
    )

})

const loginUser = asyncHandler(async(req , res )=>{
    /**
     * take email , password from the req
     * check for the errors
     * find the user 
     * check for the password
     * create refresh , access token 
     * update the last login at 
     * send the cokkie
     */

    const {email , password} = req.body;

    if(!email || !password){
        throw new ApiError(400 , "All fields are required")
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(402 , "username or email doesnt exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(403 , "incorrect password")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id)
    user.lastLoginAt = new Date()

    await user.save({validateBeforeSave : false})
    const loggedInUser = await User.findById(user._id).select("-password  -refreshToken")

    const options = {
        httpOnly : true,
        secure : false,
        sameSite: "lax"
    }
    console.log(user , accessToken)
    return res
    .status(202)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            200,
            {
            user : loggedInUser,
            refreshToken,
            accessToken 
            },
            "user logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req , res)=>{
    /**
     * find the user
     * then remove the access token
     *  
     */

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : false,
        sameSite: "lax"
    }

    return res
    .status(202)
    .cookie("accessToken" , options)
    .cookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "user logged out"))
})

const profile = asyncHandler(async(req , res)=>{
    /**
     * find the user by req.user id 
     * check if there is user or not 
     * make an whole objected need 
     * name
     * email
     * created on
     * lastlogin
     * language
     * timezone
     * 
     * lefts for later
     * stories section in profile
     */
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(406 , "cant get the user for profile")
    }

    const data = {
        fullname : user.fullname,
        email : user.email,
        avatar : user.avatar,
        lastLogin : user.lastLoginAt,
        createdOn : user.createdAt,
        language : "English",
        Timezone : "UTC"
    }
    console.log(data)
    console.log(req.user)
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                data: data
            },
            "response sent for profile successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    profile
}
/**
 * make and export register user to the router 
 * make all the utils and middlewares necessary 
 * 
 */