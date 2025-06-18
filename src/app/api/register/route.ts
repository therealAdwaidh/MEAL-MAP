// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { serverSupabase } from '@/lib/serverSupabase'

// --- In-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()

function isRateLimited(ip: string, limit = 5, interval = 10 * 60 * 1000) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (now - entry.timestamp > interval) {
    rateLimitMap.set(ip, { count: 1, timestamp: now }) // reset after interval
    return false
  }

  if (entry.count >= limit) {
    return true
  }

  entry.count += 1
  return false
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local-ip'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const { data, error } = await serverSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // ✅ required for login
  })

  if (error) {
    console.error('Supabase Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: data.user })
}
