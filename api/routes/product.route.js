import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createProduct);
router.get("/getProducts", getProducts);
router.delete("/delete/:productId", verifyUser, deleteProduct);
router.put("/update/:productId/:userId", verifyUser, updateProduct);

export default router;
