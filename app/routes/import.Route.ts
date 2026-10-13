import { Router } from "express";

import {
    createImport,
    getImports,
    getImportById,
} from "../controllers/import.Controller";

const router = Router();

router.post("/import", createImport);

router.get("/getall", getImports);

router.get("/getbyid/:id", getImportById);

export default router;