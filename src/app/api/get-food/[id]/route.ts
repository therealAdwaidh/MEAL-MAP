import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params
  console.log("🔍 Hitting API with ID:", id)

  try {
    const item = await prisma.food_items.findUnique({
      where: { id },
    })

    console.log("📦 Prisma result:", item)

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: item.id,
      title: item.title ?? 'Untitled',
      description: item.description ?? '',
      image: item.image ?? '/fallback-image.png',
      rate: item.rate,
      quantity: item.quantity,
      createdAt: item.createdAt,
      userId: item.userId,
    })
  } catch (error) {
    console.error("🔥 API error:", error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
