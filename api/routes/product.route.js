import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createProduct,
  getProducts,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createProduct);
router.get("/getProducts", getProducts);

export default router;
