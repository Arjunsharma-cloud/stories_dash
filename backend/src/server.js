import mongoose from "mongoose"
import dotenv from "dotenv"
import express from "express"
import { ApiError } from "./utils/ApiError.js"
import {app} from "./app.js"

dotenv.config();

(async ()=>{
    try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    console.log("Database connected");
    console.log(`DB Host: ${connectionInstance.connection.host}`);

    

  } catch (error) {
    console.error("Database connection failed", error);
    throw new ApiError(500, "Database is not connected");
  }
})() 
.then(()=>{
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
})
.catch((err)=>{
    console.log("failed to start the server" , err);
})