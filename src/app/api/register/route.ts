import { NextResponse } from 'next/server'
import { serverSupabase } from '@/lib/serverSupabase'
import { prisma } from '@/lib/prisma'

// --- In-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

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
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
  }

  try {
 
    // 1. Check if user already exists (manual email match)
     const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }



    // 2. Create user in Supabase
    const { data, error } = await serverSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error('Supabase Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 3. Save user in Prisma
    try {
      await prisma.user.create({
        data: {
          email,
          image: '/image4.webp', // default image
        },
      })
    } catch (err: any) {
      console.error('Prisma Error:', err.message)
      return NextResponse.json({ error: 'Database user creation failed' }, { status: 500 })
    }

    return NextResponse.json({ user: data.user }, { status: 200 })
  } catch (err: any) {
    console.error('Unexpected Error:', err.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
