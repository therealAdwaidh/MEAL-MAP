'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './post.css'
import { getCsrfToken } from 'next-auth/react'
import HomeButton from '@/components/HomeButton'

// optional CSRF, but leaving it since you had it
const csrfToken = await getCsrfToken();

export default function PostPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '', // base64
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
    console.log('handleSubmit triggered')

    // retrieve userId from localStorage
    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.error('No userId found in localStorage — please log in first')
      alert('Please log in before posting a food item.')
      return
    }

    try {
      const res = await fetch('/api/add-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          image: form.image,
          rate: parseFloat(form.rate),
          quantity: parseInt(form.quantity, 10),
          userId: userId,  // ✅ now included
        }),
      })

      console.log('response received:', res)
      console.log('response status:', res.status)

      if (res.ok) {
  console.log('Form submitted successfully. Redirecting with refresh...')
  window.location.href = '/'
}
 else {
        const errorData = await res.json()
        console.error('Submission error:', errorData)
        alert(`Error: ${errorData.error || errorData.message}`)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="food-form-container">
      <HomeButton />
      <h1 className="main-title">Add Food Item</h1>
      <form onSubmit={handleSubmit} className="food-form">
        <label>
          Food Title
          <input
            name="title"
            placeholder="Enter food title"
            value={form.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>

        <label>
          Image Upload
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
        </label>

        {form.image && (
          <div className="preview">
            <img src={form.image} alt="preview" className="preview-image" />
          </div>
        )}

        <label>
          Description
          <textarea
            name="description"
            placeholder="Describe the food item"
            value={form.description}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </label>

        <label>
          Price ($)
          <input
            name="rate"
            type="number"
            placeholder="Price"
            value={form.rate}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="form-input"
          />
        </label>

        <label>
          Quantity
          <input
            name="quantity"
            type="number"
            placeholder="Available quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
        </label>

        <button type="submit" className="submit-btn">
          Add Food Item
        </button>
      </form>

    </main>
  )
}
