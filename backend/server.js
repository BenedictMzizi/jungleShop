import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const checkoutRoutes = require('./routes/checkout');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));