import { Router } from "express";

import {
    createImport,
    getImports,
    getImportById,
} from "../controllers/import.Controller";

const router = Router();

router.post("/import", createImport);

router.get("/getimport", getImports);

router.get("/getimportbyid/:id", getImportById);

export default router;