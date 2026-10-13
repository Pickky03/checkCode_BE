import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';
import productRoutes from './routes/product.Route';
import orderRoutes from './routes/order.Route';
import adminOrderRoutes from './routes/adminOrder.Route'
import supplierRoutes from './routes/supplier.Route'
import importRoutes from './routes/import.Route'
import inventoryRoutes from './routes/inventory.Route'
import cors from 'cors';


connectDB();
const app = express();

//configure cors
app.use(cors({
  origin: true, // cho phép frontend kết nối
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`📦 [GLOBAL LOGGER] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoutes);
app.use('/api', supplierRoutes);
app.use('/api', importRoutes);
app.use('/api', inventoryRoutes);
export default app; 