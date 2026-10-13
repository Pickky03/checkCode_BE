import mongoose, { Schema } from "mongoose";

export interface ISupplier {
    name: string;
    phone?: string;
    taxCode?: string; //ma so thue
    address?: string;
    description?: string;
}

const supplierSchema = new Schema<ISupplier>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        taxCode: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },

        address: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Supplier = mongoose.model<ISupplier>(
    "Supplier",
    supplierSchema
);