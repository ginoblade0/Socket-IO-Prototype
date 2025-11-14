import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access2." });
    }

    req.body = user;
    next();
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
};
