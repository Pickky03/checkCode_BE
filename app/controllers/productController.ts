import Product from '../models/productModel';
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  const { name, quantity, time, type } = req.body;
  const product = new Product({ name, quantity, time, type });
  await product.save();
  res.status(201).json(product);
};

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.status(200).json(products);
};
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, time, type } = req.body;
  const product = await Product.findByIdAndUpdate(id, { name, quantity, time, type }, { new: true });
  res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: 'Product deleted successfully' });
};