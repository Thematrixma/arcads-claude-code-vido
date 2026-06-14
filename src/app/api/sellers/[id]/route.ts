export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const seller = await prisma.seller.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { fullName: true, email: true } },
      products: {
        where: { status: "APPROVED" },
        include: { images: { take: 1 }, category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(seller);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { role?: string };
  const body = await req.json();

  // Admin can update status; seller can update their own profile
  const updated = await prisma.seller.update({
    where: { id: params.id },
    data: {
      status: body.status,
      storeName: body.storeName,
      storeDescription: body.storeDescription,
      city: body.city,
      whatsappNumber: body.whatsappNumber,
      instagramUrl: body.instagramUrl,
      isFoundingSeller: body.isFoundingSeller,
      commissionRate: body.commissionRate ? parseFloat(body.commissionRate) : undefined,
    },
  });

  return NextResponse.json(updated);
}
