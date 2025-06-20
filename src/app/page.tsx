//app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import LogoutButton from '@/components/LogoutButton'
import PostButton from '@/components/PostButton'
import UserProfileButton from '@/components/UserProfileButton'

export default function HomePage() {
  const [items, setItems] = useState<any[]>([])

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
       <LogoutButton />
       <PostButton />
       <UserProfileButton />
      <h1 className="main-title"> Food Items</h1>
      {/* (You could reuse the form here if you like) */}

      <h2 className="section-title">Food Items</h2>
      {items.length === 0 ? (
        <div className="empty-state">No food items yet. Add your first item above!</div>
      ) : (
        <ul className="items-list">
          {items.map(item => (
            <li key={item.id} className="item-card">
              <img src={item.image} alt={item.title} className="item-image" />
              <div className="item-content">
                <div className="item-header">{item.title}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-footer">
                  <span className="price-tag">${item.rate.toFixed(2)}</span>
                  <span className="quantity-badge">Qty: {item.quantity}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}