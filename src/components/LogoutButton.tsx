'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth' })}
      style={{
        padding: '10px 16px',
        backgroundColor: '#e53e3e',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
    >
      Logout
    </button>
  )
}
