import express from "express";
import { loginUser, signinUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signin", signinUser);
router.post("/login", loginUser);

export default router;
