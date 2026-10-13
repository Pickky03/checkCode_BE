import { Router } from "express";
import {
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} from "../controllers/adminOrder.Controller";

const router = Router();

router.get("/getorder", getOrders);

router.get("/getorderbyid/:id", getOrderById);

router.patch("/updatestatus/:id/status", updateOrderStatus);

router.patch("/cancleorder/:id/cancel", cancelOrder);

export default router;