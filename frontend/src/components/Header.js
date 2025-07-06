import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';


export default function Header() {
  const { cartItems } = useCart();

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">jungleShop</Link>
      <nav className="flex gap-4">
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/cart" className="hover:underline">
          Cart ({cartItems.length})
        </Link>
      </nav>
    </header>
  );
}
