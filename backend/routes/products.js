const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you're using a MySQL pool
const { verifyAdminToken } = require('./auth'); // Middleware for admin protection

// ✅ GET all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new product (admin only)
router.post('/', verifyAdminToken, async (req, res) => {
  const { name, description, category, price, image } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, image]
    );
    res.status(201).json({ id: result.insertId, name, description, category, price, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT update product
router.put('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, image } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, category = ?, price = ?, image = ? WHERE id = ?',
      [name, description, category, price, image, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ id, name, description, category, price, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE product
router.delete('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
