import { Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model";
import Message from "../models/message.model";
import { Request } from "../types/express";
import { io, getReceiverSocketId } from "../lib/socket";

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: loggedInUserId }, { recipient: loggedInUserId }],
    }).sort({ createdAt: 1 });

    const userIds = [
      ...new Set(
        messages.map((msg) =>
          msg.sender.toString() === loggedInUserId.toString()
            ? msg.recipient
            : msg.sender
        )
      ),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password"
    );

    const orderMap: Record<string, number> = {};
    userIds.forEach((id, index) => {
      orderMap[id.toString()] = index;
    });
    users.sort((a, b) => {
      return orderMap[b.id] - orderMap[a.id];
    });

    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const recipientId = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, recipient: recipientId },
        { sender: recipientId, recipient: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const sendMessages = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const recipientId = req.params.id;
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (loggedInUserId.equals(recipientId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: recipientId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      sender: loggedInUserId,
      recipient: recipientId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(recipientId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
