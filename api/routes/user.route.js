import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  deleteUser,
  signoutUser,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/signout", signoutUser);

export default router;
