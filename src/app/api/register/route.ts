import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/user'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }
    await registerUser(email, password)
    return NextResponse.json({ message: 'User created' })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Error' }, { status: 500 })
  }
}
