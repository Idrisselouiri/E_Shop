import Product from "../models/product.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a product"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(404, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split("")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  try {
    const newProduct = new Product({ ...req.body, slug, userId: req.user.id });
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "asc" ? -1 : 1;

    const products = await Product.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $option: "i" } },
          { content: { $regex: req.query.searchTerm, $option: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ products, totalProducts, lastMonthProducts });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(404, "You are not allowed to delete this product")
    );
  }

  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  if (req.user.id !== req.body.userId && !req.user.isAdmin) {
    return next(
      errorHandler(403, "You can not allowed to update this product")
    );
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          price: req.body.price,
          imagesUrls: req.body.imagesUrls,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
