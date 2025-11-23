import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Response, NextFunction } from "express";

import { ExpressRequest } from "../types/express";

export const protectRoute = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
