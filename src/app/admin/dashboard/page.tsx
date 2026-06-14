import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Users, Store, Package, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalSellers,
    pendingSellers,
    totalProducts,
    pendingProducts,
    totalOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.seller.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.order.count(),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });
  const totalRevenue = revenueResult._sum.total ?? 0;

  const recentOrders = await prisma.order.findMany({
    include: { buyer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">لوحة الإدارة</h1>

      {/* Alerts */}
      {(pendingSellers > 0 || pendingProducts > 0) && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            {pendingSellers > 0 && (
              <p className="text-orange-800">
                {pendingSellers} بائع بانتظار الموافقة —{" "}
                <Link href="/admin/sellers" className="underline">مراجعة</Link>
              </p>
            )}
            {pendingProducts > 0 && (
              <p className="text-orange-800 mt-1">
                {pendingProducts} منتج بانتظار الموافقة —{" "}
                <Link href="/admin/products" className="underline">مراجعة</Link>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "المستخدمون", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "البائعون", value: totalSellers, icon: Store, color: "bg-green-50 text-green-600" },
          { label: "المنتجات", value: totalProducts, icon: Package, color: "bg-yellow-50 text-yellow-600" },
          { label: "الطلبات", value: totalOrders, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
          { label: "الإيرادات الكلية", value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-red-50 text-red-600" },
          { label: "بانتظار الموافقة", value: pendingSellers + pendingProducts, icon: AlertCircle, color: "bg-orange-50 text-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-900">آخر الطلبات</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">لا توجد طلبات</div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-gray-400 text-xs">{order.buyer.fullName}</p>
                </div>
                <span className="font-bold text-yellow-600">{formatPrice(order.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
