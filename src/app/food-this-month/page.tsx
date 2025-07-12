//src/app/food-this-month/page.tsx

'use client'

import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'
import PostButton from '@/components/PostButton'
import UserProfileButton from '@/components/UserProfileButton'
import HomeButton from '@/components/HomeButton'
import './FoodCart.css'
import '../globals.css'


type FoodItem = {
  id: string
  title: string
  description?: string
  image?: string
  rate: number
  quantity: number
  createdAt: string
}

export default function FoodsPage() {
  const [items, setItems] = useState<FoodItem[]>([])

  useEffect(() => {
    const cartIds = JSON.parse(localStorage.getItem("cart") || "[]")
    if (cartIds.length === 0) return

    const fetchCartItems = async () => {
      const promises = cartIds.map(async (id: string) => {
        const res = await fetch(`/api/get-food/${id}`)
        return res.json()
      })
      const data = await Promise.all(promises)
      setItems(data)
    }
    fetchCartItems()
  }, [])

  const total = items.reduce((sum, item) => sum + item.rate, 0)

  return (

    <div className="">
    <main className="food-cart-container">
      <div className="flex">
        <LogoutButton />
        <PostButton />
        <UserProfileButton />
        <HomeButton />
      </div>
      <h1 className="cart-title">FOOD YOU EATED THIS MONTH</h1>
      <hr className="cart-divider" />
      {items.length === 0 ? (
        <div className="empty-state">You haven’t added any food yet.</div>
      ) : (
        <ul className="cart-items-list">
          {items.map(item => (
            <li key={item.id} className="cart-card">
              <div className="cart-left">
                <div className="cart-avatar">A</div>
                <div className="cart-info">
                  <div className="cart-name">{item.title}</div>
                  <div className="cart-description">{item.description}</div>
                </div>
              </div>
              <div className="cart-price">
                ₹{item.rate.toFixed(0)}
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <div className="cart-total-row">
          <div className="cart-total-btn">✔ TOTAL RUPEES</div>
          <div className="cart-total-amount">₹{total.toFixed(0)}</div>
        </div>
      )}
    </main>
    </div>
    
  )
}
