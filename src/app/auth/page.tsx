// app/auth/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      if (!res.ok) {
        const { message } = await res.json()
        return setError(message)
      }
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    console.log('signIn result →', result)

    if (result?.error) {
      setError(result.error)
    } else if (result?.ok) {
      // now that the session cookie is set (via SessionProvider)…
      router.push('/')
    } else {
      setError('Unexpected signIn response')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">{isRegister ? 'Register' : 'Login'}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isRegister ? 'Register & Login' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-center">
          {isRegister ? 'Already have an account?' : 'New here?'}
          <button
            type="button"
            className="text-blue-600 ml-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </main>
  )
}






