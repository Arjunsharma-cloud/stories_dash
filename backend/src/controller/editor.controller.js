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
    _id: storyId,
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
  .status(200)
  .json(story)
});

const updateStory = asyncHandler(async(req , res)=>{
    const { storyId } = req.params;
    const userId = req.user._id;
    const incoming = req.body;

    const story = await Story.findById(storyId);
    if(!story){
        throw new ApiError(422 , "story not found")
    }

    const collaborator = story.collaborators.find(
      (c) => c.userId.toString() === userId.toString()
    );

    if (!collaborator || collaborator.role === "viewer") {
      return res.status(403).json({ message: "No edit permission" });
    }

    /* -----------------------------
       SAFE STORY UPDATES
    ----------------------------- */

    if (typeof incoming.title === "string") {
      story.title = incoming.title;
    }

    if (incoming.canvas) {
      story.canvas = incoming.canvas;
    }

    /* -----------------------------
       BLOCKS (EMBEDDED)
    ----------------------------- */
    
    if (Array.isArray(incoming.blocks)) {
      story.blocks = incoming.blocks.map((block) => {
        if (block.type === "text") {
          return {
            id: block.id,
            type: "text",
            position: block.position,
            size: block.size,
            zIndex: block.zIndex,
            locked: block.locked ?? false,
            content: block.content,
          };
        }

        if (block.type === "image") {
          return {
            id: block.id,
            type: "image",
            position: block.position,
            size: block.size,
            zIndex: block.zIndex,
            imageUrl: block.content.src,
            caption: block.content.caption,
          };
        }

        if (block.type === "chart") {
          return {
            id: block.id,
            type: "chart",
            position: block.position,
            size: block.size,
            zIndex: block.zIndex,
            chartConfig: {
              datasetId: block.content.datasetId,
              chartType: block.content.chartType,
            },
          };
        }
      });
    }
    
    /* -----------------------------
       DATASETS (USAGE ONLY)
    ----------------------------- */
    if (Array.isArray(incoming.datasets)) {
      // only update usage mapping, not dataset creation
      story.datasets = incoming.datasets.map((d) => ({
        datasetId: d.datasetId,
        usedByBlocks: d.usedByBlocks ?? [],
      }));
    }

    story.version += 1;
    story.updatedAt = new Date();

    await story.save();

    return res.status(200).json({
      success: true,
      version: story.version,
      story : story
    });
    
})

export {getOrCreatestory , updateStory}