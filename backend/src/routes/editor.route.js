import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getOrCreatestory, updateStory } from "../controller/editor.controller.js";

const router = Router();

router.route("/:storyId").get( verifyJWT , getOrCreatestory);

router.route("/:storyId").patch(verifyJWT , updateStory);



export default router;