//app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import LogoutButton from '@/components/LogoutButton'
import PostButton from '@/components/PostButton'
import UserProfileButton from '@/components/UserProfileButton'
import { useRouter } from 'next/navigation'
import AnimatedLink from "@/components/AnimatedLink";

export default function HomePage() {
  const [items, setItems] = useState<any[]>([])
  const router = useRouter()
  const handleCardClick = (id: string) => {
  window.location.href =(`/food-this-month/${id}`)
}



  const loadItems = async () => {
    const res = await fetch('/api/get-food')
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <main className="food-form-container">
  <div className="flex">
    <LogoutButton />
    <PostButton />
    <UserProfileButton />
  </div>
  <h1 className="main-title">🍽️ Foods for Tomorrow</h1>
  {items.length === 0 ? (
    <div className="empty-state">
      No food items yet. Add your first item above!
    </div>
  ) : (
    <ul className="items-list">
      {items.map((item) => (
        <li key={item.id}>
          <div
            onClick={() => handleCardClick(item.id)}
            className="item-card"
          >
            <img
              src={item.image ?? "/fallback.png"}
              alt={item.title ?? "Food Item"}
            />
            <div className="item-content">
              <div className="item-header">{item.title}</div>
              <div className="item-description">{item.description}</div>
              <div className="item-footer">
                <span className="price-tag">${item.rate.toFixed(2)}</span>
                <span className="quantity-badge">Qty: {item.quantity}</span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )}
</main>


  )
}