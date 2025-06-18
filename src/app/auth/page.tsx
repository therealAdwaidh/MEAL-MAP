// app/auth/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import './AuthPage.css' // or use `styles` from a CSS module

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  if (isRegister) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return setError(data.error || data.message || 'Registration failed')
    }

    // Wait for user creation, now attempt login manually
  }

  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  })

  if (result?.error) {
    setError(result.error)
  } else if (result?.ok) {
    router.push('/')
  } else {
    setError('Unexpected signIn response')
  }
}

  return (
    <main className="auth-container2">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="auth-title">{isRegister ? 'Register' : 'Login'}</h1>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-button">
          {isRegister ? 'Register & Login' : 'Login'}
        </button>

        <p className="auth-toggle">
          {isRegister ? 'Already have an account?' : 'New here?'}
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </main>
  )
}
