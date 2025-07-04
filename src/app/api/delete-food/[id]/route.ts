import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params:Promise< { id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const item = await prisma.food_items.findUnique({ where: { id: (await params) .id } })
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.food_items.delete({ where: { id: (await params) .id } })
  return NextResponse.json({ ok: true })
}
