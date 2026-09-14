import { Request, Response } from "express";
import * as productService from "../services/product.Service";
import { uploadImage, deleteImage } from "../services/cloudinary.Service";

//create product
export const createProduct = async (
    req: Request,
    res: Response
  ) => {
    try {
      const files = req.files as Express.Multer.File[];
  
      const images = [];
  
      if (files?.length) {
        for (const file of files) {
          const uploadedImage = await uploadImage(file.buffer);
  
          images.push(uploadedImage);
        }
      }
    //   console.log("body:", req.body);
    //   console.log("files:", req.files);
      const product = await productService.createProduct({
        ...req.body,
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        images,
      });
  
      return res.status(201).json({
        success: true,
        message: "Tạo sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra",
      });
    }
  };


// get products
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await productService.getProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Có lỗi xảy ra",
    });
  }
};

// get product by id
export const getProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await productService.getProductById(
      req.params.id as string
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Có lỗi xảy ra",
    });
  }
};

// update product
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id as string;

    const existingProduct =
      await productService.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const files =
      (req.files as Express.Multer.File[]) || [];

    // 1. Ảnh hiện tại
    let images = [...existingProduct.images];

    // 2. Danh sách publicId cần xóa
    let removeImageIds: string[] = [];

    if (req.body.removeImageIds) {
      removeImageIds = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];
    }

    // 3. Xóa ảnh khỏi Cloudinary
    for (const publicId of removeImageIds) {
      await deleteImage(publicId);
    }

    // 4. Xóa ảnh khỏi mảng hiện tại
    images = images.filter(
      (image) =>
        !removeImageIds.includes(image.publicId)
    );

    // 5. Upload ảnh mới
    for (const file of files) {
      const uploadedImage =
        await uploadImage(file.buffer);

      images.push(uploadedImage);
    }

    // 6. Data update
    const updateData: any = {
      ...req.body,
      images,
    };

    // Không lưu removeImageIds vào Product
    delete updateData.removeImageIds;

    if (req.body.quantity !== undefined) {
      updateData.quantity =
        Number(req.body.quantity);
    }

    if (req.body.price !== undefined) {
      updateData.price =
        Number(req.body.price);
    }

    const updatedProduct =
      await productService.updateProduct(
        productId,
        updateData
      );

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra",
    });
  }
};

// delete product
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await productService.deleteProduct(
      req.params.id as string
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Có lỗi xảy ra",
    });
  }
};