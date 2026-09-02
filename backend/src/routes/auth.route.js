import { Router } from "express";
import {
  userRegister,
  userLogin,
  verifyMail,
  refreshToken
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/verify", verifyMail);
router.get("/refresh", refreshToken);

export default router;
