import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, image } = await req.json()

  if (!email || !image) {
    return NextResponse.json({ error: 'Missing email or image' }, { status: 400 })
  }

  try {
    await prisma.user.update({
      where: { email },
      data: { image }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Prisma update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
