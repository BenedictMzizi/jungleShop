import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    imageFile: null,
  });
  const [editing, setEditing] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('http://13.61.48.159:4000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      imageFile: null,
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', description: '', category: '', price: '', imageFile: null });
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('price', form.price);
    if (form.imageFile) {
      data.append('image', form.imageFile);
    }

    try {
      const res = await axios.post('http://13.61.48.159:4000/api/upload/product', data);
      alert('✅ Product uploaded!');
      setForm({ id: null, name: '', description: '', category: '', price: '', imageFile: null });
      setEditing(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://13.61.48.159:4000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <Header />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
          <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="w-full" />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editing ? 'Update' : 'Add'} Product
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <li key={p.id} className="border p-4 rounded shadow bg-white">
              <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover mb-2" />
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{p.category}</p>
              <p className="mb-2">{p.description}</p>
              <p className="font-semibold mb-2">${p.price}</p>
              <div className="flex justify-between">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(p)}>Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

