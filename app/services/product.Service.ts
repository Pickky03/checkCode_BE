import { Product, IProduct } from "../models/product.Model";

export const createProduct = async (
  data: Partial<IProduct>
) => {
  return await Product.create(data);
};

export const getProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

export const getProductById = async (id: string) => {
  return await Product.findById(id);
};

export const updateProduct = async (
  id: string,
  data: Partial<IProduct>
) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};