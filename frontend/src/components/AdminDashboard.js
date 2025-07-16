import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Header'

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    imageFile: null,
    image_url: '',
  })
  const [editing, setEditing] = useState(false)

  const headers = { email, password }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { headers })
      if (Array.isArray(res.data)) setProducts(res.data)
      else setProducts([])
    } catch {
      setAuthenticated(false)
      setProducts([])
    }
  }

  useEffect(() => {
    if (authenticated) fetchProducts()
  }, [authenticated])

  const handleLogin = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products`, { headers })
      .then(() => setAuthenticated(true))
      .catch(() => alert('❌ Invalid email or password'))
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'imageFile') setForm({ ...form, imageFile: files[0] })
    else setForm({ ...form, [name]: value })
  }

  const handleEdit = (product) => {
    setForm({ ...product, imageFile: null })
    setEditing(true)
  }

  const handleCancel = () => {
    setForm({
      id: null,
      name: '',
      description: '',
      category: '',
      price: '',
      imageFile: null,
      image_url: '',
    })
    setEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = form.image_url
    if (form.imageFile) {
      try {
        const imgForm = new FormData()
        imgForm.append('image', form.imageFile)
        const uploadRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/upload`, imgForm, { headers })
        imageUrl = uploadRes.data.imageUrl
      } catch {
        alert('❌ Image upload failed')
        return
      }
    }
    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price),
      image_url: imageUrl,
    }
    try {
      if (editing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${form.id}`, productData, { headers })
        alert('✅ Product updated!')
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, productData, { headers })
        alert('✅ Product added!')
      }
      handleCancel()
      fetchProducts()
    } catch {
      alert('❌ Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, { headers })
      fetchProducts()
    } catch {}
  }

  if (!authenticated) {
    return (
      <div className="p-4 max-w-sm mx-auto mt-20 border rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">
          Log In
        </button>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
          <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="number" name="price" placeholder="Price in cents (e.g. 1999)" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="w-full" />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Add'} Product</button>
            {editing && <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Array.isArray(products) ? products : []).map((p) => (
            <li key={p.id} className="border p-4 rounded shadow bg-white">
              <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover mb-2 rounded" />
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{p.category}</p>
              <p className="mb-2">{p.description}</p>
              <p className="font-semibold mb-2">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(p.price / 100)}</p>
              <div className="flex justify-between">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(p)}>Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
