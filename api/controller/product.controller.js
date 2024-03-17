import Product from "../models/product.model.js";

export const createProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a product"));
  }
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json("product has been created");
  } catch (error) {
    next(error);
  }
};
