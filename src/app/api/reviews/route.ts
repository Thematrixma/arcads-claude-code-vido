export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const body = await req.json();

  const review = await prisma.review.create({
    data: {
      buyerId: userId,
      productId: body.productId,
      sellerId: body.sellerId,
      orderId: body.orderId,
      rating: parseInt(body.rating),
      comment: body.comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
