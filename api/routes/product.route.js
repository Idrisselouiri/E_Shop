import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createProduct } from "../controller/product.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createProduct);

export default router;
