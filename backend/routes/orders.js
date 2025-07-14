import express from 'express';
const router = express.Router();

let orders = [];

router.get('/', (req, res) => {
  res.json(orders);
});

router.post('/', (req, res) => {
  const order = req.body;
  if (!order || !order.id) {
    return res.status(400).json({ error: 'Order with id is required' });
  }
  orders.push(order);
  res.status(201).json(order);
});

export default router;
