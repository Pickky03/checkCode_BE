import { Request, Response } from "express";
import * as supplierService from "../services/supplier.Service";

export const createSupplier = async (
    req: Request,
    res: Response
) => {
    try {
        const supplier =
            await supplierService.createSupplier(
                req.body
            );

        return res.status(201).json({
            success: true,
            message: "Tạo nhà cung cấp thành công",
            data: supplier,
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

export const getSuppliers = async (
    req: Request,
    res: Response
) => {
    try {
        const suppliers =
            await supplierService.getSuppliers(req.query);

        return res.status(200).json({
            success: true,
            data: suppliers,
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

export const getSupplierById = async (
    req: Request,
    res: Response
) => {
    try {
        const supplier =
            await supplierService.getSupplierById(
                req.params.id as string
            );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhà cung cấp",
            });
        }

        return res.status(200).json({
            success: true,
            data: supplier,
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

export const updateSupplier = async (
    req: Request,
    res: Response
) => {
    try {
        const supplier =
            await supplierService.updateSupplier(
                req.params.id as string,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Cập nhật nhà cung cấp thành công",
            data: supplier,
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

export const deleteSupplier = async (
    req: Request,
    res: Response
) => {
    try {
        await supplierService.deleteSupplier(
            req.params.id as string
        );

        return res.status(200).json({
            success: true,
            message: "Xóa nhà cung cấp thành công",
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