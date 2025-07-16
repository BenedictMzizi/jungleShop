import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { pool } from '../db/index.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

dotenv.config();

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/product', verifyAdminToken, upload.single('image'), async (req, res) => {
  const { name, description, category, price } = req.body;

  if (!name || !description || !category || !price || !req.file) {
    return res.status(400).json({ error: 'Missing fields or image' });
  }

  try {
    const params = {
      Bucket: process.env.S3_BUCKET || process.env.AWS_S3_BUCKET,
      Key: `products/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(params).promise();
    const imageUrl = uploadResult.Location;

    await pool.query(
      'INSERT INTO products (name, description, category, price, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, imageUrl]
    );

    res.status(200).json({
      message: 'Product uploaded and saved successfully',
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload or database insert failed' });
  }
});

export default router;
