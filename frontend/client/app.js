import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data));
  }, []);

  const checkout = async () => {
    const response = await axios.post('/api/checkout', { cartItems: cart });
    window.location.href = response.data.url;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">jungleShop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map(p => (
          <div key={p.id} className="border rounded p-2 shadow">
            <h2>{p.name}</h2>
            <p>${(p.price / 100).toFixed(2)}</p>
            <button className="bg-green-500 text-white px-2 py-1" onClick={() => setCart([...cart, p])}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2" onClick={checkout}>Checkout</button>
      </div>
    </div>
  );
}

export default App;