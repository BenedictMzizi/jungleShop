import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/products').then(res => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setFiltered(
      products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border p-4 rounded shadow hover:shadow-lg bg-white"
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded" />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="font-semibold">${product.price / 100}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
