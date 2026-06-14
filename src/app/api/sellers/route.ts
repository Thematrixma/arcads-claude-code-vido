import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const sellers = await prisma.seller.findMany({
    where: status ? { status } : undefined,
    include: {
      user: { select: { fullName: true, email: true, phone: true } },
      _count: { select: { products: true, orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sellers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
  if (existingUser) {
    return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      password: hashedPassword,
      phone: body.phone,
      role: "SELLER",
    },
  });

  const seller = await prisma.seller.create({
    data: {
      userId: user.id,
      storeName: body.storeName,
      storeDescription: body.storeDescription,
      city: body.city,
      whatsappNumber: body.whatsappNumber,
      instagramUrl: body.instagramUrl,
      status: "PENDING",
    },
  });

  return NextResponse.json({ user, seller }, { status: 201 });
}
