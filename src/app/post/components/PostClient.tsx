"use client"
import React, { useState, FormEvent } from 'react'
import { useFood, FoodItem } from '@/context/FoodContext'
import { serverSupabase } from '@/lib/serverSupabase'
import '../post.css'

export default async function HomePage() {
  const { data: items, error } = await serverSupabase
    .from("food_items")
    .select("*")

  if (error) {
    console.error("Supabase fetch error:", error.message)
    return <p>Error loading items.</p>
  }

  return (
    <div>
      <h1>All Food Items</h1>
      {items.map((item, idx) => (
        <div key={idx}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}