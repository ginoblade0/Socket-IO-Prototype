import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware";
import { protectRoute } from "../middleware/auth.middleware";
import { updateContactSettings } from "../controllers/user.controller";

const router = Router();
router.use(limiter, protectRoute);
// router.post("/contact-settings/:id", getContactSettings);
router.post("/update-contact-settings/:id", updateContactSettings);

export default router;
