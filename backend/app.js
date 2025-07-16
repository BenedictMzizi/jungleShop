// backend/app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
import checkoutRoutes from './routes/checkout.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import verifyAdminToken from './middleware/verifyAdminToken.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeInstance = stripe;

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});
export const s3 = new AWS.S3();

app.use('/api/products', verifyAdminToken, productRoutes);
app.use('/api/admin/upload', verifyAdminToken, uploadRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

export default app;
