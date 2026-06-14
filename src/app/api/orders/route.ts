export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string };
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sellerId");

  let orders;

  if (user.role === "ADMIN") {
    orders = await prisma.order.findMany({
      include: {
        buyer: { select: { fullName: true, email: true } },
        items: { include: { product: { select: { nameAr: true } }, seller: { select: { storeName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (user.role === "SELLER" && sellerId) {
    orders = await prisma.orderItem.findMany({
      where: { sellerId },
      include: {
        order: { include: { buyer: { select: { fullName: true } } } },
        product: { select: { nameAr: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    });
  } else {
    orders = await prisma.order.findMany({
      where: { buyerId: user.id },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            seller: { select: { storeName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const body = await req.json();

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { seller: true } } },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.priceAtTime * item.quantity,
    0
  );
  const shippingFee = body.shippingFee ?? 25;
  const total = subtotal + shippingFee;

  const order = await prisma.order.create({
    data: {
      buyerId: userId,
      orderNumber: generateOrderNumber(),
      status: "PAID",
      subtotal,
      shippingFee,
      total,
      paymentStatus: "PAID",
      shippingAddress: body.shippingAddress,
      city: body.city,
      phone: body.phone,
      notes: body.notes,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          sellerId: item.product.sellerId,
          quantity: item.quantity,
          unitPrice: item.priceAtTime,
          totalPrice: item.priceAtTime * item.quantity,
          sellerStatus: "NEW",
        })),
      },
    },
    include: { items: true },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: total,
      status: "PAID",
      paymentProvider: "bank_transfer",
    },
  });

  // Create payout records per seller
  const sellerTotals: Record<string, number> = {};
  for (const item of cart.items) {
    const sid = item.product.sellerId;
    sellerTotals[sid] = (sellerTotals[sid] ?? 0) + item.priceAtTime * item.quantity;
  }

  for (const [sid, gross] of Object.entries(sellerTotals)) {
    const seller = await prisma.seller.findUnique({ where: { id: sid } });
    const commission = gross * ((seller?.commissionRate ?? 10) / 100);
    await prisma.payout.create({
      data: {
        sellerId: sid,
        orderId: order.id,
        grossAmount: gross,
        commissionAmount: commission,
        netAmount: gross - commission,
        payoutStatus: "PENDING",
      },
    });
  }

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json(order, { status: 201 });
}
