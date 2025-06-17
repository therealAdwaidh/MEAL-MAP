import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, image, rate, quantity } = body

    const item = await prisma.foodItem.create({
      data: {
        title,
        description,
        image,
        rate: parseFloat(rate),
        quantity: parseInt(quantity, 10),
      },
    })

    // Convert BigInt fields to string or number for JSON
    const safeItem = {
      ...item,
      id: item.id.toString(), // or use Number(item.id) if you prefer
      quantity: Number(item.quantity),
    }

    return NextResponse.json(safeItem)
  } catch (err: any) {
    console.error('Insert error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}