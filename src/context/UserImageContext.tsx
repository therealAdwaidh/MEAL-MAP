'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

const UserImageContext = createContext<{
  image: string
  setImage: (url: string) => void
} | null>(null)

export const UserImageProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<string>('https://i.pravatar.cc/150')
  return (
    <UserImageContext.Provider value={{ image, setImage }}>
      {children}
    </UserImageContext.Provider>
  )
}

export const useUserImage = () => {
  const context = useContext(UserImageContext)
  if (!context) throw new Error('useUserImage must be used within UserImageProvider')
  return context
}
