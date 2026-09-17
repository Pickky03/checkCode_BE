import mongoose, { Schema } from "mongoose";

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct {
  sku: string;
  name: string;
  images: IProductImage[];
  quantity: number;
  category: string;
  price: number;
  description?: string;
  material?: string;
  status: "active" | "inactive";
}

const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    material: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);