import { Router } from "express";

import {
    getInventory,
    getLowStockProducts,
    getOutOfStockProducts,
} from "../controllers/inventory.Controller";

const router = Router();

router.get("/getinventory", getInventory);

router.get(
    "/low-stock",
    getLowStockProducts
);

router.get(
    "/out-of-stock",
    getOutOfStockProducts
);

export default router;