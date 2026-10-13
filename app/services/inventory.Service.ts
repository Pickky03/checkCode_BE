import { Product } from "../models/product.Model";

export const getInventory = async () => {
    return await Product.find()
        .select("sku name quantity category status images")
        .sort({ quantity: 1 });
};

export const getLowStockProducts = async (
    threshold: number = 5
) => {
    return await Product.find({
        quantity: {
            $lte: threshold,
        },
        status: "active",
    })
        .select("sku name quantity category images")
        .sort({ quantity: 1 });
};

export const getOutOfStockProducts = async () => {
    return await Product.find({
        quantity: 0,
    })
        .select("sku name quantity category images")
        .sort({ name: 1 });
};