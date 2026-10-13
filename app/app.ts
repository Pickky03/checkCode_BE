import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';
import productRoutes from './routes/product.Route';
import orderRouter from './routes/order.Route';
import adminOrderRouter from './routes/adminOrder.Route'
import supplierRoutes from './routes/supplier.Route'
import importRoutes from './routes/import.Route'
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
app.use('/api', orderRouter);
app.use('/api', adminOrderRouter)
app.use('/api', supplierRoutes)
app.use('/api', importRoutes)
export default app; 