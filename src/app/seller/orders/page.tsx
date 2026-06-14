import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";

export default async function SellerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) redirect("/");

  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: seller.id },
    include: {
      order: { include: { buyer: { select: { fullName: true, phone: true } } } },
      product: { select: { nameAr: true } },
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الطلبات ({orderItems.length})</h1>

      {orderItems.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm text-gray-400">
          <p>لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.product.nameAr}</p>
                  <p className="text-xs text-gray-400">طلب: {item.order.orderNumber}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.sellerStatus)}`}>
                  {getStatusLabel(item.sellerStatus)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {item.order.buyer.fullName} · {item.order.buyer.phone ?? ""}
                </span>
                <span className="font-bold text-yellow-600">{formatPrice(item.totalPrice)}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(item.order.createdAt).toLocaleDateString("ar-SA")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
