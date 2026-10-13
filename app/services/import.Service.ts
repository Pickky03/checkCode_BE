import mongoose from "mongoose";

import { Import } from "../models/import.Model";
import { Product } from "../models/product.Model";
import { Supplier } from "../models/supplier.Model";

interface CreateImportInput {
    productId: string;
    supplierId: string;
    quantity: number;
    cost: number;
}

export const createImport = async (
    data: CreateImportInput
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const quantity = Number(data.quantity);
        const cost = Number(data.cost);

        if (
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {
            throw new Error(
                "Số lượng nhập phải lớn hơn 0"
            );
        }

        if (
            Number.isNaN(cost) ||
            cost < 0
        ) {
            throw new Error(
                "Giá nhập không hợp lệ"
            );
        }

        const product = await Product.findById(
            data.productId
        ).session(session);

        if (!product) {
            throw new Error(
                "Không tìm thấy sản phẩm"
            );
        }

        const supplier = await Supplier.findById(
            data.supplierId
        ).session(session);

        if (!supplier) {
            throw new Error(
                "Không tìm thấy nhà cung cấp"
            );
        }

        const totalCost = quantity * cost;

        const [importRecord] = await Import.create(
            [
                {
                    product: product._id,
                    supplier: supplier._id,
                    quantity,
                    cost,
                    totalCost,
                    importedAt: new Date(),
                },
            ],
            {
                session,
            }
        );

        product.quantity += quantity;

        await product.save({
            session,
        });

        await session.commitTransaction();

        return importRecord;
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        await session.endSession();
    }
};

export const getImports = async () => {
    return await Import.find()
        .populate(
            "product",
            "sku name images quantity price"
        )
        .populate(
            "supplier",
            "name phone taxCode address"
        )
        .sort({
            importedAt: -1,
        });
};

export const getImportById = async (
    id: string
) => {
    return await Import.findById(id)
        .populate(
            "product",
            "sku name images quantity price"
        )
        .populate(
            "supplier",
            "name phone taxCode address"
        );
};