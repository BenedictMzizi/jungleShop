// backend/app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import mysql from 'mysql2/promise';
import Stripe from 'stripe';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_KEY);

// AWS S3 setup
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// MySQL DB connection pool
const pool = mysql.createPool({
  uri: process.env.DB_URI,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🧑 Admin Auth Middleware
const adminAuth = (req, res, next) => {
  const { email, password } = req.headers;
  if (email === 'bennydrizi@gmail.com' && password === 'Admin123') return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// 🌐 Routes
app.get('/', (req, res) => res.send('jungleShop API running ✅'));

// 🖼 Upload product image (Admin only)
app.post('/api/upload', adminAuth, async (req, res) => {
  if (!req.files?.image) return res.status(400).send('No file uploaded.');
  const file = req.files.image;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: Date.now() + '-' + file.name,
    Body: file.data,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };
  try {
    const result = await s3.upload(params).promise();
    res.json({ imageUrl: result.Location });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed.');
  }
});

// 📦 Get products
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  res.json(rows);
});

// ➕ Add product (Admin only)
app.post('/api/products', adminAuth, async (req, res) => {
  const { name, description, category, price, image } = req.body;
  const [result] = await pool.query(
    'INSERT INTO products (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)',
    [name, description, category, price, image]
  );
  res.json({ id: result.insertId });
});

// 💳 Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  const { items, email } = req.body;
  const line_items = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    await pool.query('INSERT INTO orders (email, total) VALUES (?, ?)', [
      email,
      items.reduce((sum, i) => sum + i.price, 0),
    ]);

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.listen(3000, () => console.log('🌍 Backend live at http://localhost:3000'));
