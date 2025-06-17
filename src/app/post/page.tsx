'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './post.css'

export default function PostPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',     // this will hold the base64 data URL
    rate: '',
    quantity: '',
  })

  // Read file as Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          image: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/add-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          image: form.image,                  // send base64
          rate: parseFloat(form.rate),
          quantity: parseInt(form.quantity, 10),
        })
      })
      if (res.ok) {
        setForm({ title: '', description: '', image: '', rate: '', quantity: '' })
        router.push('/')  // back to home list
      } else {
        console.error(await res.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="food-form-container">
      <h1 className="main-title">Add Food Item</h1>
      <form onSubmit={handleSubmit} className="food-form">
        <input
          name="title"
          placeholder="Food Title"
          value={form.title}
          onChange={handleChange}
          required
          className="form-input"
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-input"
        />

        {/* preview */}
       {form.image && (
        <div className="preview">
          <img src={form.image} alt="preview" className="preview-image" />
        </div>
      )}

        <textarea
          name="description"
          placeholder="Describe your delicious food item..."
          value={form.description}
          onChange={handleChange}
          required
          className="form-textarea"
        />

        <input
          name="rate"
          type="number"
          placeholder="Price ($)"
          value={form.rate}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          className="form-input"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity Available"
          value={form.quantity}
          onChange={handleChange}
          required
          min="0"
          className="form-input"
        />

        <button type="submit" className="submit-btn">
          Add Food Item
        </button>
      </form>
    </main>
  )
}