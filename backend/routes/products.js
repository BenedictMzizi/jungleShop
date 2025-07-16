import express from 'express';
import { pool } from '../db/index.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyAdminToken, async (req, res) => {
  const { name, description, category, price, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, category, price, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, image_url]
    );
    res.status(201).json({ id: result.insertId, name, description, category, price, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, category = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, category, price, image_url, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ id, name, description, category, price, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
