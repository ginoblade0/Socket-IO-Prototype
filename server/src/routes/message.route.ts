import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller";

const router = Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

export default router;
