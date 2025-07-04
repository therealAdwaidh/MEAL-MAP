// app/api/get-my-foods/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'      // if you use NextAuth
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)
    
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const items = await prisma.food_items.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(items)
}
