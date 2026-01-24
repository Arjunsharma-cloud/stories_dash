import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getOrCreatestory } from "../controller/editor.controller.js";

const router = Router();

router.route("/:storyId" , verifyJWT , getOrCreatestory);

export default router;