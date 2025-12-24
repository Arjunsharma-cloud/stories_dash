import mongoose , {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const collaboratorSchema = new Schema(
    {
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },

        role:{
            type:String,
            enum:['editor' , 'viewer'],
            required:true,
        },

        addedAT:{
            type:Date,
            default:Date.now
        }
    }
)

const projectSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
        },

        description:{
            type:String,
        },

        ownerID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },

        visibility:{
            type:String,
            enum:['public' , 'private'],
            default:'private',
            required:true,
        },

        lastModifiedAt:{
            type:Date,
            default:Date.now,
        },

        collaborators:{
            type:[collaboratorSchema],
            default:[]
        },
    },
    {
        timestamps:true,
    }
)

export const Project = mongoose.model('Project' , projectSchema);