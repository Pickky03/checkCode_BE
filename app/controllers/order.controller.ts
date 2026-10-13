import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const order =
      await orderService.createOrder(req.body);

    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
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