import { Router } from "express";

import { upload } from "../middleware/upload.middleware";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.Controller";

const router = Router();

router.post(
  "/createproduct",
  upload.array("images", 10),
  createProduct
);

router.get("/getproducts", getProducts);

router.get("/getproductbyid/:id", getProductById);

router.put(
  "/updateproduct/:id",
  upload.array("images", 10),
  updateProduct
);

router.delete("/deleteproduct/:id", deleteProduct);

export default router;