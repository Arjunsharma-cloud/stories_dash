import crypto from "crypto";
import StoryInvite from "../models/storyInvite.js";
import Story from "../models/project.model.js";
import Chat from "../models/Chat.js";

export const generateInvite = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { role } = req.body;

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isOwner = story.authorId.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only owner can invite" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await StoryInvite.create({
      token,
      storyId,
      role,
      createdBy: req.user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const link = `${process.env.BASE_URL}/collab/accept?token=${token}`;

    res.json({ link } , invite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;

    const invite = await StoryInvite.findOne({ token });

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired" });
    }

    if (invite.usedCount >= invite.maxUses) {
      return res.status(400).json({ message: "Invite fully used" });
    }

    const story = await Story.findById(invite.storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const alreadyCollaborator = story.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );

    if (!alreadyCollaborator) {
      story.collaborators.push({
        userId: req.user._id,
        role: invite.role,
      });
      await story.save();
    }

    invite.usedCount += 1;
    await invite.save();

    // create chat if not exists
    let chat = await Chat.findOne({
      participants: { $all: [invite.createdBy, req.user._id] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [invite.createdBy, req.user._id],
      });
    }

    res.json({
      message: "Joined successfully",
      storyId: story._id,
      chatId: chat._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
