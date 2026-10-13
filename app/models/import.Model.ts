import mongoose, { Schema } from "mongoose";

export interface IImport {
    product: mongoose.Types.ObjectId;
    supplier: mongoose.Types.ObjectId;
    quantity: number;
    cost: number;
    totalCost: number;
    importedAt: Date;
}

const importSchema = new Schema<IImport>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        cost: {
            type: Number,
            required: true,
            min: 0,
        },

        totalCost: {
            type: Number,
            required: true,
            min: 0,
        },

        importedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Import = mongoose.model<IImport>(
    "Import",
    importSchema
);