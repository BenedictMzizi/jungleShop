import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { pool } from '../db/index.js';

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `products/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

router.post('/upload-product', upload.single('image'), async (req, res) => {
  const { name, description, category, price } = req.body;
  const imageUrl = req.file.location;

  try {
    const query = `
      INSERT INTO products (name, description, category, price, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(query, [name, description, category, price, imageUrl]);

    res.json({
      message: 'Product uploaded successfully',
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

export default router;

