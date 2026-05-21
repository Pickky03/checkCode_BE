import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  quantity: number;
  time: Date;
  type: string;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  time: { type: Date, required: true },
  type: { type: String, required: true },
}, {
  timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;