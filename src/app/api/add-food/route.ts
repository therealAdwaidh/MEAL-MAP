//app/api/add-food/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, image, rate, quantity, userId } = body

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
     console.log("Incoming food create with userId =", userId)
    const item = await prisma.food_items.create({
      data: {
        title,
        description,
        image,
        rate: parseFloat(rate),
        quantity: parseInt(quantity, 10),
        userId     // <--- required
      },
    })


    return NextResponse.json(item)
  } catch (err: any) {
    console.error('Insert error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

