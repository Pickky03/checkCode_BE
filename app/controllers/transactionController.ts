import { Request, Response } from "express";
import Product from "../models/productModel";
import Inventory from "../models/inventoryModel";
import Customer from "../models/customerModel";
//create transaction
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
// update
export const updateTransaction = async (  req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      transactionType,
    } = req.body;

    // =========================
    // FIND OLD INVENTORY
    // =========================
    const oldInventory = await Inventory.findById(id);

    if (!oldInventory) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // =========================
    // FIND OLD PRODUCT
    // =========================
    const oldProduct = await Product.findById(
      oldInventory.product
    );

    if (!oldProduct) {
      return res.status(404).json({
        message: "Old product not found",
      });
    }

    // =========================
    // ROLLBACK STOCK CŨ
    // =========================
    const rollbackValue =
      oldInventory.transactionType === "buy"
        ? -oldInventory.quantity
        : oldInventory.quantity;

    await Product.findByIdAndUpdate(oldProduct._id, {
      $inc: {
        quantity: rollbackValue,
      },
    });

    // =========================
    // CUSTOMER
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
    } else {
      customer.name = name;
      customer.DOB = DOB;
      customer.cccd = cccd;
      customer.address = address;

      await customer.save();
    }

    // =========================
    // PRODUCT
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
    // CHECK STOCK
    // =========================
    if (
      transactionType === "sell" &&
      product.quantity < quantity
    ) {
      return res.status(400).json({
        message: "Không đủ hàng trong kho",
      });
    }

    // =========================
    // UPDATE NEW STOCK
    // =========================
    const newValue =
      transactionType === "buy"
        ? quantity
        : -quantity;

    await Product.findByIdAndUpdate(product._id, {
      $inc: {
        quantity: newValue,
      },
    });

    // =========================
    // UPDATE INVENTORY
    // =========================
    const updatedInventory =
      await Inventory.findByIdAndUpdate(
        id,
        {
          product: product._id,
          customer: customer._id,
          transactionType,
          quantity,
          date,
        },
        { new: true }
      );

    return res.json({
      message: "Update transaction success",
      updatedInventory,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
//get transaction
export const getTransactions = async (req: Request, res: Response) => {
  try {

    const transactions = await Inventory.find()
      .populate("product")
      .populate("customer")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Get transactions success",
      total: transactions.length,
      transactions,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
// get transactionby id
export const getTransactionById = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const transaction = await Inventory.findById(id)
      .populate("product")
      .populate("customer");

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.json({
      message: "Get transaction success",
      transaction,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
//delete transaction
export const deleteTransaction = async (req: Request,res: Response) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findById(id).populate("product");

    if (!inventory) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const product: any = inventory.product;

    // =========================
    // ROLLBACK STOCK
    // =========================
    let value = 0;

    if (inventory.transactionType === "buy") {
      value = -inventory.quantity;
    } else {
      value = inventory.quantity;
    }

    await Product.findByIdAndUpdate(product._id, {
      $inc: {
        quantity: value,
      },
    });

    // =========================
    // DELETE INVENTORY
    // =========================
    await Inventory.findByIdAndDelete(id);

    return res.json({
      message: "Delete transaction success",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

// delete many transaction
export const deleteManyTransaction = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    const inventories = await Inventory.find({
      _id: { $in: ids },
    }).populate("product");

    // =========================
    // ROLLBACK STOCK
    // =========================
    for (const inventory of inventories) {
      const product: any = inventory.product;

      let value = 0;

      if (inventory.transactionType === "buy") {
        value = -inventory.quantity;
      } else {
        value = inventory.quantity;
      }

      await Product.findByIdAndUpdate(product._id, {
        $inc: {
          quantity: value,
        },
      });
    }

    // =========================
    // DELETE MANY
    // =========================
    await Inventory.deleteMany({
      _id: { $in: ids },
    });

    return res.json({
      message: "Delete many transaction success",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
// =========================
// get inventory
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