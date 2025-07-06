const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

router.post('/', upload.single('image'), (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `products/${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ imageUrl: data.Location });
  });
});

module.exports = router;