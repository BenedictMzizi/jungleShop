import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { pool } from '../db/index.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `products/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, filename);
    },
  }),
});

router.post('/upload-product', verifyAdminToken, upload.single('image'), async (req, res) => {
  const { name, description, category, price } = req.body;

  if (!req.file || !name || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const imageUrl = req.file.location;

  try {
    const query = `
      INSERT INTO products (name, description, category, price, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(query, [name, description, category, parseFloat(price), imageUrl]);

    res.status(201).json({
      message: 'Product uploaded successfully',
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

export default router;
