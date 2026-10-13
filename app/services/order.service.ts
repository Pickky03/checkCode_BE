import { Order } from "../models/order.Model";
import { Product } from "../models/product.Model";

interface CreateOrderInput {
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

  items: {
    productId: string;
    quantity: number;
  }[];
}

export const createOrder = async (
  data: CreateOrderInput
) => {
  if (!data.items || data.items.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const orderItems = [];

  let subtotal = 0;

  for (const item of data.items) {
    const product = await Product.findById(
      item.productId
    );

    if (!product) {
      throw new Error(
        `Không tìm thấy sản phẩm ${item.productId}`
      );
    }

    if (item.quantity <= 0) {
      throw new Error("Số lượng sản phẩm không hợp lệ");
    }

    if (product.quantity < item.quantity) {
      throw new Error(
        `Sản phẩm ${product.name} không đủ hàng`
      );
    }

    const itemSubtotal =
      product.price * item.quantity;

    subtotal += itemSubtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0]?.url || "",
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const shippingFee = 30000;

  const total = subtotal + shippingFee;

  const orderCode =
    "ORD-" +
    Date.now();

  const order = await Order.create({
    orderCode,

    customer: data.customer,

    shippingAddress: data.shippingAddress,

    items: orderItems,

    subtotal,

    shippingFee,

    total,

    paymentMethod: "COD",

    paymentStatus: "unpaid",

    status: "pending",
  });

  // Trừ tồn kho
  for (const item of data.items) {
    await Product.findByIdAndUpdate(
      item.productId,
      {
        $inc: {
          quantity: -item.quantity,
        },
      }
    );
  }

  return order;
};