// src/components/BackButton.tsx
'use client'

type BackButtonProps = {
  id: string
}

export default function BackButton({ id }: BackButtonProps) {
  const handleClick = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.includes(id)) {
      cart.push(id)
      localStorage.setItem('cart', JSON.stringify(cart))
    }
    window.location.href = '/food-this-month'
  }

  return (
    <button className="back-button" onClick={handleClick}>
      ← Add to Cart & Back
    </button>
  )
}
