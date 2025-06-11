"use client"
import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react'

export interface FoodItem {
  title: string
  description: string
  image: string
  rate: number
  quantity: number
}

interface FoodContextType {
  items: FoodItem[]
  addItem: (item: FoodItem) => void
}

const FoodContext = createContext<FoodContextType | undefined>(undefined)

export function FoodProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FoodItem[]>([])

  const addItem = (item: FoodItem) => {
    setItems(prev => [item, ...prev])
  }

  return (
    <FoodContext.Provider value={{ items, addItem }}>
      {children}
    </FoodContext.Provider>
  )
}

export function useFood() {
  const ctx = useContext(FoodContext)
  if (!ctx) throw new Error("useFood must be used within FoodProvider")
  return ctx
}