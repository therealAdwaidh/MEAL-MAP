'use client'

import { useRouter } from 'next/navigation'

export default function PostButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/post')}
      style={{
        padding: '10px 16px',
        backgroundColor: '#2b6cb0',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
    >
      Add New Food
    </button>
  )
}
