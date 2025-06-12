"use client"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { useFood } from '../context/FoodContext'

export default async function HomeClient() {
  const { items } = useFood()
    const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth')
  }

  return (
    <main className="container">
      <h1>All Food Items</h1>
      <div className="items-list">
        {items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="item-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Rate: ${item.rate.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}