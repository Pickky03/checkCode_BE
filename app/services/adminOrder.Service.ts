import { Order } from "../models/order.Model";
import { Product } from "../models/product.Model";

export const getOrders = async () => {
    return await Order.find()
        .sort({ createdAt: -1 });
};

export const getOrderById = async (
    id: string
) => {
    return await Order.findById(id);
};

export const updateOrderStatus = async (
    id: string,
    newStatus: string
) => {
    const order = await Order.findById(id);

    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    if (
        order.status === "cancelled" ||
        order.status === "delivered"
    ) {
        throw new Error(
            "Không thể thay đổi trạng thái của đơn hàng này"
        );
    }

    const statusFlow: Record<string, string> = {
        pending: "confirmed",
        confirmed: "packing",
        packing: "shipping",
        shipping: "delivered",
    };

    const expectedStatus = statusFlow[order.status];

    if (newStatus !== expectedStatus) {
        throw new Error(
            `Không thể chuyển từ ${order.status} sang ${newStatus}`
        );
    }

    order.status = newStatus as
        | "confirmed"
        | "packing"
        | "shipping"
        | "delivered";

    await order.save();

    return order;
};

export const cancelOrder = async (
    id: string
) => {
    const order = await Order.findById(id);

    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.status === "cancelled") {
        throw new Error("Đơn hàng đã bị hủy");
    }

    if (order.status === "delivered") {
        throw new Error(
            "Không thể hủy đơn hàng đã giao"
        );
    }

    // Hoàn lại tồn kho
    for (const item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    quantity: item.quantity,
                },
            }
        );
    }

    order.status = "cancelled";

    await order.save();

    return order;
};