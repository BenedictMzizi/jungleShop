import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`/api/products`).then(res => {
      const found = res.data.find(p => p.id.toString() === id);
      setProduct(found);
    });
  }, [id]);

  if (!product) return (
    <div>
      <Header />
      <p className="text-center mt-20">Loading product...</p>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded mb-4" />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-2">Category: {product.category}</p>
        <p className="mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4">${product.price / 100}</p>
        <button
          onClick={() => addToCart(product)}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
