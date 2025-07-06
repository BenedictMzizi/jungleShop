import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<p className="text-center mt-20">Page not found</p>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
