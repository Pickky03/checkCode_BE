import express from "express";

import {
  createTransaction,
  getDashboard,
} from "../controllers/transactionController";

const router = express.Router();

router.post("/transaction", createTransaction);
router.get("/dashboard", getDashboard)

export default router;