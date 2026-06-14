import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1 },
              seller: { select: { storeName: true } },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const { productId, quantity } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "APPROVED") {
    return NextResponse.json({ error: "Product not available" }, { status: 400 });
  }

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + (quantity ?? 1) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: quantity ?? 1,
        priceAtTime: product.price,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await req.json();
  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, quantity } = await req.json();

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return NextResponse.json({ success: true });
}
