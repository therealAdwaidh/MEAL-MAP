// app/app/my-foods/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './my-foods.css'


type Food = {
  id: string
  title: string | null
  image: string | null
  rate: number
  quantity: number
}

export default function MyFoodsPage() {
  const [items, setItems] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/get-my-foods')
      const data = await res.json()
      setItems(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this item?')
    if (!ok) return
    const res = await fetch(`/api/delete-food/${id}`, { method: 'DELETE' })
    if (res.ok) setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <p className="my-food-loading">Loading…</p>
  if (!Array.isArray(items)) return <p className="my-food-error">Failed to load your items: not authorised or server error.</p>

  return (
    <main className="my-food-container">
      <button onClick={() => router.back()} className="my-food-back-btn">◀ Back</button>
      <h1 className="my-food-title">My Food Posts</h1>

      {items.length === 0 && <p className="my-food-empty">You haven’t posted anything yet.</p>}
      
      <ul className="my-food-list">
        {items.map(item => (
          <li key={item.id} className="my-food-card">
            {item.image && (
              <img src={item.image} alt={item.title ?? ''} className="my-food-image" />
            )}
            <h2 className="my-food-card-title">{item.title ?? 'Untitled'}</h2>
            <p className="my-food-card-meta">Rate ₹{item.rate} • Qty {item.quantity}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="my-food-delete-btn"
            >
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
