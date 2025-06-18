// app/api/add-food/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, image, rate, quantity } = body

    const item = await prisma.food_items.create({
      data: {
        title,
        description,
        image,
        rate: parseFloat(rate),
        quantity: parseInt(quantity, 10),
      },
    })

    // Convert BigInt fields (if any) to serializable values
    const safeItem = {
      ...item,
      id: typeof item.id === 'bigint' ? item.id.toString() : item.id,
      quantity: typeof item.quantity === 'bigint' ? Number(item.quantity) : item.quantity,
      rate: typeof item.rate === 'bigint' ? Number(item.rate) : item.rate,
    }

    return NextResponse.json(safeItem)
  } catch (err: any) {
    console.error('Insert error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}