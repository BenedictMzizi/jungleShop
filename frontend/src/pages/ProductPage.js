import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://13.61.48.159:4000/api/products')
      .then(res => {
        const found = res.data.find(p => p.id.toString() === id);
        if (found) {
          setProduct(found);
        } else {
          setError('❌ Product not found.');
        }
      })
      .catch(err => {
        console.error('❌ API error:', err);
        setError('❌ Failed to load product. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        {loading && (
          <p className="text-center mt-20 text-gray-500">Loading product...</p>
        )}

        {error && (
          <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>
        )}

        {product && !loading && !error && (
          <>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Category: {product.category}</p>
            <p className="mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-4">
              {new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
              }).format(product.price / 100)}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
