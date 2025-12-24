import mongoose ,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true,
            unique:false,
            trim:true,

        },

        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            unique:true,
        },

        avatar:{
            type:String,
        },

        password:{
            type:String,
            required:[true , 'Password is required'],
        },

        refreshToken:{
            type:String,
        },

        status:{
            type:String,
            enum:['active' , 'disabled'],
            default:'active',
            required:true,
        },

        lastLoginAt:{
            type:Date,
            default:null
        },

    },
    {
        timestamps:true,
    }
)

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
      return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User' , userSchema);
