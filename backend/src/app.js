import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import dataRouter from "./routes/data.route.js";
import editorRouter from "./routes/editor.route.js"
import dotenv from "dotenv";
import { upload } from "./middlewares/multer.middleware.js";
import { reciever } from "./DataSetSql/receiver.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRouter);
/** do the mounting other wise it will not work
 * and the rest of work is 3 chats back
 */
app.post("/data/upload-dataset", upload.single("dataset"), reciever);

// app.use("/data" , dataRouter);

app.use("/api/stories" , editorRouter);

export { app };
