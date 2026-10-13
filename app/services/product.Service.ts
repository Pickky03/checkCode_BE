import { Product, IProduct } from "../models/product.Model";
import {
  getPagination,
  getPaginationMeta,
  buildSearchFilter,
} from "../utils/query";

export const createProduct = async (
  data: Partial<IProduct>
) => {
  return await Product.create(data);
};

export const getProducts = async (query: any) => {
  const { page, limit, skip } =
    getPagination(query.page, query.limit);

  const filter: any = {
    ...buildSearchFilter(
      query.search,
      ["name", "sku"]
    ),
  };

  // filter riêng của Product
  if (query.category) {
    filter.category = query.category;
  }

  if (query.material) {
    filter.material = {
      $regex: query.material,
      $options: "i",
    };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte =
        Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte =
        Number(query.maxPrice);
    }
  }

  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .populate("supplier")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

  return {
    data: products,
    pagination: getPaginationMeta(
      total,
      page,
      limit
    ),
  };
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