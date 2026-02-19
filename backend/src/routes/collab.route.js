import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateInvite, acceptInvite } from "../controller/collab.controller.js";

const router = express.Router();

router.post("/:storyId/invite", verifyJWT, generateInvite);
router.get("/accept", verifyJWT, acceptInvite);

export default router;
