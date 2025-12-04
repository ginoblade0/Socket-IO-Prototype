import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware";
import { protectRoute } from "../middleware/auth.middleware";
import {
  getAllContacts,
  getChats,
  getMessages,
  sendMessages,
} from "../controllers/message.controller";

const router = Router();
router.use(limiter, protectRoute);
router.get("/contacts", getAllContacts);
router.get("/chats", getChats);
router.get("/:id", getMessages);
router.post("/send/:id", sendMessages);

export default router;
