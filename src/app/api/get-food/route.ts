// app/api/get-food/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const items = await prisma.food_items.findMany({orderBy: {createdAt:'desc'}})

  // Transform BigInt IDs to string
  const safeItems = items.map((item) => ({
    ...item,
    id: item.id.toString(), // convert BigInt to string
  }));

  return NextResponse.json(safeItems);
}
