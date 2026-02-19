import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ============================
   INDEX FOR PAGINATION
============================ */
MessageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);
