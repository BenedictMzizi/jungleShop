import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="border-b py-2 flex justify-between">
              <div>
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-4">${item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-600">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <h2 className="font-bold">Total: ${total.toFixed(2)}</h2>
            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 mt-2">Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}
