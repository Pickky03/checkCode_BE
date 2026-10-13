import mongoose, { Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder {
  orderCode: string;

  customer: {
    name: string;
    phone: string;
    email?: string;
  };

  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    address: string;
    note?: string;
  };

  items: IOrderItem[];

  subtotal: number;

  shippingFee: number;

  total: number;

  paymentMethod: "COD";

  paymentStatus: "unpaid" | "paid";

  status:
    | "pending"
    | "confirmed"
    | "packing"
    | "shipping"
    | "delivered"
    | "cancelled";
}

const orderSchema = new Schema<IOrder>(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: String,
    },

    shippingAddress: {
      province: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      ward: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      note: String,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,

        sku: String,

        image: String,

        price: Number,

        quantity: Number,

        subtotal: Number,
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packing",
        "shipping",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);