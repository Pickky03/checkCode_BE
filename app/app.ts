import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';
import productRoutes from './routes/product.Route';
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
// app.use(
//   (
//     err: any,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {  
//     if (err instanceof multer.MulterError) {
//       console.log("Multer error field:", err.field);

//       return res.status(400).json({
//         success: false,
//         message: err.message,
//         field: err.field,
//       });
//     }

//     next(err);
//   }
// );
export default app; 