import { Router } from "express";

import {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} from "../controllers/supplier.Controller";

const router = Router();

router.post("/createsupplier", createSupplier);

router.get("/getsupplier", getSuppliers);

router.get("/getsupplierbyid/:id", getSupplierById);

router.patch("/update/:id", updateSupplier);

router.delete("/delete/:id", deleteSupplier);

export default router;