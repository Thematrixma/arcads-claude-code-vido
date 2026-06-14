import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;
  const seller = await prisma.seller.findUnique({ where: { userId } });

  if (!seller) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">لم يتم العثور على بيانات المتجر</p>
      </div>
    );
  }

  const [totalProducts, totalOrders, recentOrders] = await Promise.all([
    prisma.product.count({ where: { sellerId: seller.id } }),
    prisma.orderItem.count({ where: { sellerId: seller.id } }),
    prisma.orderItem.findMany({
      where: { sellerId: seller.id },
      include: {
        order: true,
        product: { select: { nameAr: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
      take: 5,
    }),
  ]);

  const revenueData = await prisma.payout.aggregate({
    where: { sellerId: seller.id },
    _sum: { netAmount: true },
  });

  const totalRevenue = revenueData._sum.netAmount ?? 0;

  const isPending = seller.status === "PENDING";

  return (
    <div>
      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-medium">طلبك قيد المراجعة</p>
          <p className="text-yellow-700 text-sm mt-1">
            سيتم مراجعة متجرك من قِبل الإدارة وإخطارك بالنتيجة قريباً
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
          <p className="text-gray-500 text-sm">{seller.city}</p>
        </div>
        <Link
          href="/seller/products/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-600"
        >
          + إضافة منتج
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "المنتجات", value: totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
          { label: "الطلبات", value: totalOrders, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
          { label: "الإيرادات", value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-yellow-50 text-yellow-600" },
          { label: "العمولة", value: `${seller.commissionRate}%`, icon: Clock, color: "bg-purple-50 text-purple-600" },
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
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-900">آخر الطلبات</h2>
          <Link href="/seller/orders" className="text-sm text-yellow-600 hover:underline">
            عرض الكل
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product.nameAr}</p>
                  <p className="text-xs text-gray-400">{item.order.orderNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.sellerStatus)}`}>
                    {getStatusLabel(item.sellerStatus)}
                  </span>
                  <span className="text-sm font-bold text-yellow-600">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
