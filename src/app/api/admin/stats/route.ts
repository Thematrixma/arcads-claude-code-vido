import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalSellers,
    pendingSellers,
    totalProducts,
    pendingProducts,
    totalOrders,
    totalUsers,
  ] = await Promise.all([
    prisma.seller.count(),
    prisma.seller.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });

  return NextResponse.json({
    totalSellers,
    pendingSellers,
    totalProducts,
    pendingProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueResult._sum.total ?? 0,
  });
}
