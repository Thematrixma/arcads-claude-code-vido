import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      seller: {
        select: {
          id: true,
          storeName: true,
          storeDescription: true,
          city: true,
          instagramUrl: true,
          isFoundingSeller: true,
          status: true,
        },
      },
      category: true,
      reviews: {
        include: { buyer: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const user = session.user as { id?: string; role?: string };

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role === "SELLER") {
    const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
    if (!seller || seller.id !== product.sellerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      descriptionAr: body.descriptionAr,
      price: body.price ? parseFloat(body.price) : undefined,
      stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity) : undefined,
      preparationTimeDays: body.preparationTimeDays ? parseInt(body.preparationTimeDays) : undefined,
      status: body.status,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.update({
    where: { id: params.id },
    data: { status: "INACTIVE" },
  });

  return NextResponse.json({ success: true });
}
