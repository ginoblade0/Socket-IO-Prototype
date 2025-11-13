import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import { generateToken } from "../lib/utils";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;
  try {
    // if (password.length < 8) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password must be at least 8 characters" });
    // }

    // if (password.length < 8) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password must be at least 8 characters" });
    // }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hash,
      avatar: avatar,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = "Signup error: " + error.message;
    } else {
      errorMessage = "An unknown error occurred.";
    }
    console.log(errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};

export const login = (_req: Request, res: Response) => {
  res.send("login route");
};

export const logout = (_req: Request, res: Response) => {
  res.send("logout route");
};
