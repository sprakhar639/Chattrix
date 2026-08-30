import { Router } from "express";
import {
  userRegister,
  userLogin,
  verifyMail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/verify", verifyMail);

export default router;
