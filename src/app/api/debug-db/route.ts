import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if User table exists and fetch one record
    const userCheck = await prisma.user.findFirst()

    return NextResponse.json({
      message: '✅ Connected to DB successfully.',
      userSample: userCheck || null,
      emailFieldCheck: userCheck?.email ? 'email field present ✅' : 'email field missing ⚠️',
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: '❌ Prisma query failed.',
        details: err.message,
      },
      { status: 500 }
    )
  }
}
