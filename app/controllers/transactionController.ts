import { Request, Response } from "express";
import Product from "../models/productModel";
import Inventory from "../models/inventoryModel";
import Customer from "../models/customerModel";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      date,
      name,
      DOB,
      cccd,
      address,
      phone,
      productName,
      type,
      quantity,
      transactionType, // "buy" | "sell"
    } = req.body;

    // =========================
    // 1. CUSTOMER (find or create)
    // =========================
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = await Customer.create({
        name,
        DOB,
        cccd,
        address,
        phone,
      });
    }

    // =========================
    // 2. PRODUCT (find or create)
    // =========================
    let product = await Product.findOne({
      name: productName,
      type,
    });

    if (!product) {
      product = await Product.create({
        name: productName,
        type,
        quantity: 0,
      });
    }

    // =========================
    // 3. CHECK STOCK (khi bán)
    // =========================
    if (transactionType === "sell" && product.quantity < quantity) {
      return res.status(400).json({
        message: "Không đủ hàng trong kho",
      });
    }

    // =========================
    // 4. CREATE INVENTORY (LOG)
    // =========================
    const inventory = await Inventory.create({
      product: product._id,
      customer: customer._id,
      transactionType,
      quantity,
      date: date || new Date(),
    });

    // =========================
    // 5. UPDATE STOCK
    // =========================
    const value = transactionType === "buy" ? quantity : -quantity;

    await Product.findByIdAndUpdate(product._id, {
      $inc: { quantity: value },
    });

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      message: "Tạo giao dịch thành công",
      inventory,
      productStock: product.quantity + value,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

// =========================
// DASHBOARD
// =========================
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalImport = await Inventory.aggregate([
      { $match: { transactionType: "buy" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const totalExport = await Inventory.aggregate([
      { $match: { transactionType: "sell" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    return res.json({
      totalImport: totalImport[0]?.total || 0,
      totalExport: totalExport[0]?.total || 0,
      totalStock: totalStock[0]?.total || 0,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};