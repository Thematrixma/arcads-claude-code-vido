import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import Image from "next/image";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">لا توجد طلبات بعد</p>
          <Link href="/products" className="text-yellow-600 hover:underline">تسوق الآن</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {order.orderNumber}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].imageUrl}
                        alt={item.product.nameAr}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{order.items.length} منتج</span>
                <span className="font-bold text-yellow-600">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
