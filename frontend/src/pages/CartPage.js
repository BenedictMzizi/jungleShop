import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkout`, {
        items: cartItems,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('❌ Checkout failed:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              ← Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {cartItems.map((item, index) => (
                <div key={index} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold mb-1">
                      {new Intl.NumberFormat('en-ZA', {
                        style: 'currency',
                        currency: 'ZAR',
                      }).format(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Total:{' '}
                {new Intl.NumberFormat('en-ZA', {
                  style: 'currency',
                  currency: 'ZAR',
                }).format(total)}
              </h2>
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>

            <div className="mt-6 flex justify-between">
              <Link
                to="/"
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                ← Continue Shopping
              </Link>

              <button
                onClick={handleCheckout}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
