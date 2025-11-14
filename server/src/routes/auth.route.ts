import { Router } from "express";
import {
  checkAuth,
  signup,
  login,
  logout,
  updateAvatar,
} from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-avatar", protectRoute, updateAvatar);
router.get("/check", protectRoute, checkAuth);

export default router;
