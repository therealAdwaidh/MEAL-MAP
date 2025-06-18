'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUserImage } from '@/context/UserImageContext'


export default function UserProfileButton() {
  const { data: session, status } = useSession()
  const router = useRouter()
  

  if (status !== 'authenticated') return null

  const userImage = session.user?.image || '/image4.webp'

// fallback image

  return (
    <button
      onClick={() => router.push('/profile')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: 0
      }}
      title="View Profile"
    >
      <img
        src={userImage}
        alt="User Avatar"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ccc'
        }}
      />
    </button>
  )
}
