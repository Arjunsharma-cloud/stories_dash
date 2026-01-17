import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reciever } from "../DataSetSql/receiver.js";

const router = Router();

router.route("/upload-dataset").post(upload.single("dataset") , reciever)

export default router;