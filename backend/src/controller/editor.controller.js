import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
import { Story } from "../models/project.model.js";
import mongoose from "mongoose";

dotenv.config();

const getOrCreatestory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "login to use this ");
  }

  let story = await Story.findById(storyId);

  if (story) {
    return res.status(200).json(story);
  }

  story = await Story.create({
    _id: new mongoose.Types.ObjectId(storyId),
    authorId: userId,
    title: "Untitled Story",
    status: "draft",
    collaborators: [
      {
        userId,
        role: "owner",
      },
    ],
    canvas: {
      width: 3000,
      height: 3000,
      background: "#ffffff",
      zoom: 1,
    },
    blocks: [],
    version: 1,
    datasets:[]
  });

  return res
  .status(202)
  .json(story)
});


export {getOrCreatestory}