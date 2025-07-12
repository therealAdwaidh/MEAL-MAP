// app/api/add-food/route.ts
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, image, rate, quantity } = body;

    console.log("Incoming food create by user =", session.user.email);

    // ✅ Fetch user ID by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const item = await prisma.food_items.create({
      data: {
        title,
        description,
        image,
        rate: parseFloat(rate),
        quantity: parseInt(quantity, 10),
        userId: user.id,  // ✅ Correct: use UUID
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Insert error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
