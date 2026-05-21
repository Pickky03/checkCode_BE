import mongoose from 'mongoose';
export interface IInventory extends mongoose.Document {
    product: mongoose.Types.ObjectId;
    customer?: mongoose.Types.ObjectId;
    transactionType: "buy" | "sell";
    quantity: number;
    date: Date;
}
const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
    transactionType: { type: String, enum: ["buy", "sell"], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true },
});
const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
export default Inventory;
