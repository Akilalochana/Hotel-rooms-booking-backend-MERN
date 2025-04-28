import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", addProduct)
productRouter.get("/", getProducts)
productRouter.put("/:key", updateProduct)
productRouter.delete("/:key", deleteProduct)
productRouter.get("/:key", getProductById)

export default productRouter;