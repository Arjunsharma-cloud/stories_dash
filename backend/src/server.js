import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { ApiError } from "./utils/ApiError.js";
import { app } from "./app.js";
import { client } from "./DataSetSql/db.js";

dotenv.config();

async function startServer() {
  try {
    // 1️⃣ CONNECT TO POSTGRES
    await client.connect();
    console.log("PostgreSQL connected");

    // 2️⃣ CONNECT TO MONGODB
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    console.log("MongoDB connected");
    console.log(`DB Host: ${connectionInstance.connection.host}`);

    // 3️⃣ START EXPRESS SERVER
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });

  } catch (error) {
    console.error("Startup failed:", error);
    throw new ApiError(500, "Server failed to start");
  }
}

startServer();
