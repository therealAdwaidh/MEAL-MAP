'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import './AuthPage.css'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'login' | 'register'>('select')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setIsLoading(true)

  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  })

  if (result?.error) {
    setError(result.error)
  } else if (result?.ok) {
    try {
      // fetch userId after login
      const meRes = await fetch('/api/me')
      const meData = await meRes.json()
      if (meData.id) {
        localStorage.setItem('userId', meData.id)
        console.log('userId restored after login:', meData.id)
      } else {
        console.warn('userId missing after login')
      }
    } catch (err) {
      console.error('Failed to fetch /api/me:', err)
    }

    router.push('/')
  } else {
    setError('Login failed unexpectedly')
  }

  setIsLoading(false)
}


 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setIsLoading(true)

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setIsLoading(false)
      return setError(data.error || 'Registration failed')
    }

    // We do not store here to avoid race with redirect
    // Instead, store after signIn below

    // Wait briefly to ensure Supabase sync
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
    } else if (result?.ok) {
      // fetch from /api/me to store Prisma ID reliably
      try {
        const meRes = await fetch('/api/me')
        const meData = await meRes.json()
        if (meData.id) {
          localStorage.setItem("userId", meData.id)
          console.log("userId restored after register/login:", meData.id)
        } else {
          console.warn("userId missing after register/login")
        }
      } catch (err) {
        console.error("Failed to fetch /api/me after register:", err)
      }

      router.push('/')
    } else {
      setError('Login failed unexpectedly')
    }
  } catch (err) {
    setError('Unexpected error during registration.')
  } finally {
    setIsLoading(false)
  }
}



  return (
    <main className="auth-container">
      {step === 'select' && (
        <div className="auth-select">
          <h1>Welcome</h1>
          <div className="auth-options">
            <button onClick={() => setStep('login')}>I already have an account</button>
            <button onClick={() => setStep('register')}>I'm a new user</button>
          </div>
        </div>
      )}

      {step === 'login' && (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          {error && <p className="auth-error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p>
            New here?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={() => setStep('register')}
            >
              Register
            </button>
          </p>
        </form>
      )}

      {step === 'register' && (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          {error && <p className="auth-error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={() => setStep('login')}
            >
              Login
            </button>
          </p>
        </form>
      )}
    </main>
  )
}
