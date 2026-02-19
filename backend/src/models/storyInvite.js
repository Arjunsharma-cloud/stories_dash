import mongoose from "mongoose";

const StoryInviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    storyId: {
      type: String,
      ref: "Story",
      required: true,
    },

    role: {
      type: String,
      enum: ["editor", "viewer"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto cleanup after expiration
    },

    maxUses: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StoryInvite", StoryInviteSchema);
