import mongoose from 'mongoose';
export interface ICustomer extends mongoose.Document {
    name: string;
    DOB: Date;
    cccd: string;
    address: string;
    phone: string;
}
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    DOB: { type: Date, required: false },
    cccd: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
});
const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
export default Customer;