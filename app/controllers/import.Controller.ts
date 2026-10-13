import { Request, Response } from "express";

import * as importService from "../services/import.Service";

export const createImport = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            productId,
            supplierId,
            quantity,
            cost,
        } = req.body;

        if (
            !productId ||
            !supplierId ||
            quantity === undefined ||
            cost === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Thiếu productId, supplierId, quantity hoặc cost",
            });
        }

        const importRecord =
            await importService.createImport({
                productId,
                supplierId,
                quantity: Number(quantity),
                cost: Number(cost),
            });

        return res.status(201).json({
            success: true,
            message: "Nhập hàng thành công",
            data: importRecord,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};

export const getImports = async (
    req: Request,
    res: Response
) => {
    try {
        const imports =
            await importService.getImports();

        return res.status(200).json({
            success: true,
            data: imports,
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

export const getImportById = async (
    req: Request,
    res: Response
) => {
    try {
        const importRecord =
            await importService.getImportById(
                req.params.id as string
            );

        if (!importRecord) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy phiếu nhập",
            });
        }

        return res.status(200).json({
            success: true,
            data: importRecord,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};