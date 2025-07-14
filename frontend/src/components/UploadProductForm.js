import React, { useState } from 'react';
import axios from 'axios';

export default function UploadProductForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) data.append(key, form[key]);

    try {
      const res = await axios.post('http://13.53.170.24:4000/api/upload/product', data);
      alert('Uploaded: ' + res.data.imageUrl);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check console.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Upload Product</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required /><br />
      <input name="description" placeholder="Description" onChange={handleChange} required /><br />
      <input name="category" placeholder="Category" onChange={handleChange} required /><br />
      <input name="price" placeholder="Price" type="number" onChange={handleChange} required /><br />
      <input name="image" type="file" accept="image/*" onChange={handleChange} required /><br /><br />
      <button type="submit">Upload Product</button>
    </form>
  );
}
