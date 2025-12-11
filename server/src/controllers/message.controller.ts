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

    const lastMessages = [
      ...new Set(
        messages.map((msg) => ({
          _id:
            msg.sender.toString() === loggedInUserId.toString()
              ? msg.recipient
              : msg.sender,
          lastMsg: msg.text !== "" ? msg.text : msg.image,
          isSender:
            msg.sender.toString() === loggedInUserId.toString() ? false : true,
          createdAt: msg.createdAt,
        }))
      ),
    ];

    const users = await User.find({ _id: { $in: lastMessages } }).select(
      "-password"
    );

    const result = users.map((item1) => {
      const lastMessage = lastMessages.findLast(
        (item2) => item2._id.toString() === item1._id.toString()
      );
      if (lastMessage) {
        return {
          _id: item1._id,
          username: item1.username,
          email: item1.email,
          avatar: item1.avatar,
          lastMsg: lastMessage.lastMsg,
          isSender: lastMessage.isSender,
          createdAt: lastMessage.createdAt,
        };
      } else {
        return item1;
      }
    });

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    res.status(200).json(result);
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
      io.to(receiverSocketId).emit("newUnreadMessage");
    }

    res.status(201).json(newMessage);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
