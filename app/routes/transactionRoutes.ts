import express from "express";

import {
  createTransaction,
  getDashboard,
  updateTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  deleteManyTransaction
} from "../controllers/transactionController";

const router = express.Router();

router.post("/transaction", createTransaction);
router.get("/gettransaction", getTransactions);
router.get("/dashboard", getDashboard);
router.delete("/delete/:id", deleteTransaction);
router.delete("deletemany", deleteManyTransaction);
router.get("/gettransactionbyid/:id", getTransactionById);
router.put("/updatetransaction/:id", updateTransaction)

export default router;