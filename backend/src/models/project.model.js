// models/Story.js
import mongoose from "mongoose";
import BlockSchema from "./blockSchema.model.js";

const StorySchema = new mongoose.Schema(
  {

    _id: {
      type: String, // ✅ REQUIRED
  },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Story",
    },

    description: String,

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    collaborators: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "editor",
        },
      },
    ],

    canvas: {
      width: Number,
      height: Number,
      background: String,
      zoom: Number,
    },

    blocks: [BlockSchema],

    datasets: [
      {
        datasetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dataset",
        },
        usedByBlocks: [String], // block IDs
      },
    ],

    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    publishedAt: Date,

    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Story =  mongoose.model("Story", StorySchema);
