import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imagesUrls: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);
export default Product;
