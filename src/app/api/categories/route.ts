import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { nameAr: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      slug: body.slug,
      imageUrl: body.imageUrl,
      parentId: body.parentId,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
