export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const disputes = await prisma.dispute.findMany({
    include: {
      order: { select: { orderNumber: true } },
      buyer: { select: { fullName: true } },
      seller: { select: { storeName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(disputes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const body = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const dispute = await prisma.dispute.create({
    data: {
      orderId: body.orderId,
      buyerId: userId,
      sellerId: order.items[0].sellerId,
      reason: body.reason,
      status: "OPEN",
    },
  });

  return NextResponse.json(dispute, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.dispute.update({
    where: { id: body.id },
    data: { status: body.status, adminNotes: body.adminNotes },
  });

  return NextResponse.json(updated);
}
