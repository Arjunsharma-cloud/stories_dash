import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["dm", "group"],
      default: "dm",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },

    // Optional: if later you want project-based chat
    storyId: {
      type: String,
      ref: "Story",
      default: null,
    },
  },
  { timestamps: true }
);

/* ============================
   INDEXES (VERY IMPORTANT)
============================ */
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageAt: -1 });

export default mongoose.model("Chat", ChatSchema);
