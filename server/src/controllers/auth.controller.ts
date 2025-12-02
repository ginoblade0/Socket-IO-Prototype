import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import { ExpressRequest } from "../types/express";
import { sendWelcomeEmail } from "../emails/handlers";

export const checkAuth = (req: ExpressRequest, res: Response) => {
  try {
    const user = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
    };
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, avatar } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hash,
      avatar: avatar,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      try {
        await sendWelcomeEmail(
          newUser.email,
          newUser.username,
          process.env.CLIENT_URL || ""
        );
      } catch (error) {
        console.error("Failed to send welcome email: ", error);
      }

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const logout = (_req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};

export const updateAvatar = async (req: ExpressRequest, res: Response) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      transformation: [
        { width: 250, height: 250, crop: "fill", gravity: "faces" },
      ],
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
