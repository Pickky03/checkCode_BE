import { Request, Response } from "express";
import * as inventoryService from "../services/inventory.Service";

export const getInventory = async (
    req: Request,
    res: Response
) => {
    try {
        const products =
            await inventoryService.getInventory();

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};

export const getLowStockProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : 5;

        const products =
            await inventoryService.getLowStockProducts(
                threshold
            );

        return res.status(200).json({
            success: true,
            threshold,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};

export const getOutOfStockProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const products =
            await inventoryService.getOutOfStockProducts();

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};