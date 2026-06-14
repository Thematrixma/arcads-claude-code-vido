export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const sellerId = searchParams.get("sellerId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  } else {
    where.status = "APPROVED";
  }

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.OR = [
      { nameAr: { contains: q } },
      { nameEn: { contains: q } },
      { descriptionAr: { contains: q } },
    ];
  }

  if (sellerId) {
    where.sellerId = sellerId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        seller: { select: { id: true, storeName: true, city: true, isFoundingSeller: true } },
        category: { select: { nameAr: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string };
  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  let sellerId = body.sellerId;
  if (user.role === "SELLER") {
    const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
    if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    sellerId = seller.id;
  }

  const product = await prisma.product.create({
    data: {
      sellerId,
      categoryId: body.categoryId,
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      descriptionAr: body.descriptionAr,
      descriptionEn: body.descriptionEn,
      price: parseFloat(body.price),
      stockQuantity: parseInt(body.stockQuantity ?? "0"),
      preparationTimeDays: parseInt(body.preparationTimeDays ?? "3"),
      status: user.role === "ADMIN" ? "APPROVED" : "PENDING_REVIEW",
    },
  });

  if (body.images?.length) {
    await prisma.productImage.createMany({
      data: body.images.map((url: string, i: number) => ({
        productId: product.id,
        imageUrl: url,
        sortOrder: i,
      })),
    });
  }

  return NextResponse.json(product, { status: 201 });
}
