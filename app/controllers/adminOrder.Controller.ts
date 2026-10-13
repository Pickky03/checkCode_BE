import { Request, Response } from "express";
import * as adminOrderService from "../services/adminOrder.Service";

export const getOrders = async (
    req: Request,
    res: Response
) => {
    try {
        const orders = await adminOrderService.getOrders();

        return res.status(200).json({
            success: true,
            data: orders,
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

export const getOrderById = async (
    req: Request,
    res: Response
) => {
    try {
        const order = await adminOrderService.getOrderById(
            req.params.id as string
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
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

export const updateOrderStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const order = await adminOrderService.updateOrderStatus(
            req.params.id as string,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: order,
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

export const cancelOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const order = await adminOrderService.cancelOrder(
            req.params.id as string
        );

        return res.status(200).json({
            success: true,
            message: "Hủy đơn hàng thành công",
            data: order,
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