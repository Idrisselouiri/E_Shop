import express from "express";
import { signinUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signin", signinUser);

export default router;
