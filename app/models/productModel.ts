import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  quantity: number;
  time: Date;
  type: "24k" | "10k" | "23k" | "bac";
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  time: { type: Date, required: false },
  type: { type: String, enum: ["24k", "10k", "23k", "bac"], required: true },
}, {
  timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;