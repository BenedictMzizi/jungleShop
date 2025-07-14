import express from 'express';
const router = express.Router();

let cartItems = [];

router.get('/', (req, res) => {
  res.json(cartItems);
});

router.post('/', (req, res) => {
  const item = req.body;
  if (!item || !item.id) {
    return res.status(400).json({ error: 'Item with id is required' });
  }
  cartItems.push(item);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  cartItems = cartItems.filter(item => item.id !== id);
  res.json({ message: `Item ${id} removed from cart` });
});

export default router;

