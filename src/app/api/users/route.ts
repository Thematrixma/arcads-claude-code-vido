import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      password: hashedPassword,
      phone: body.phone,
      role: "BUYER",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
