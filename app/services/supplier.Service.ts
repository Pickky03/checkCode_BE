import { Supplier, ISupplier } from "../models/supplier.Model";
import {
    getPagination,
    getPaginationMeta,
    buildSearchFilter,
} from "../utils/query";
export const createSupplier = async (
    data: Partial<ISupplier>
) => {
    // Kiểm tra taxCode nếu có
    if (data.taxCode) {
        const existingSupplier = await Supplier.findOne({
            taxCode: data.taxCode,
        });

        if (existingSupplier) {
            throw new Error("Mã số thuế đã tồn tại");
        }
    }

    return await Supplier.create(data);
};

export const getSuppliers = async (
    query: any
) => {
    const { page, limit, skip } =
        getPagination(query.page, query.limit);

    const filter = buildSearchFilter(
        query.search,
        ["name", "phone", "taxCode"]
    );

    const [suppliers, total] =
        await Promise.all([
            Supplier.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Supplier.countDocuments(filter),
        ]);

    return {
        data: suppliers,
        pagination: getPaginationMeta(
            total,
            page,
            limit
        ),
    };
};

export const getSupplierById = async (
    id: string
) => {
    return await Supplier.findById(id);
};

export const updateSupplier = async (
    id: string,
    data: Partial<ISupplier>
) => {
    const supplier = await Supplier.findById(id);

    if (!supplier) {
        throw new Error("Không tìm thấy nhà cung cấp");
    }

    // Nếu sửa taxCode thì kiểm tra trùng
    if (
        data.taxCode &&
        data.taxCode !== supplier.taxCode
    ) {
        const existingSupplier = await Supplier.findOne({
            taxCode: data.taxCode,
            _id: {
                $ne: id,
            },
        });

        if (existingSupplier) {
            throw new Error("Mã số thuế đã tồn tại");
        }
    }

    return await Supplier.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
};

export const deleteSupplier = async (
    id: string
) => {
    const supplier = await Supplier.findById(id);

    if (!supplier) {
        throw new Error("Không tìm thấy nhà cung cấp");
    }

    return await Supplier.findByIdAndDelete(id);
};