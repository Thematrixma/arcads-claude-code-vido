import { prisma } from "@/lib/prisma";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      buyer: { select: { fullName: true } },
      items: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الطلبات ({orders.length})</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-right">رقم الطلب</th>
              <th className="p-3 text-right">المشتري</th>
              <th className="p-3 text-right">المنتجات</th>
              <th className="p-3 text-right">الإجمالي</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 font-mono text-xs font-bold text-gray-900">{order.orderNumber}</td>
                <td className="p-3 text-gray-700">{order.buyer.fullName}</td>
                <td className="p-3 text-gray-500">{order.items.length}</td>
                <td className="p-3 font-bold text-yellow-600">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="p-3 text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-400">لا توجد طلبات</div>
        )}
      </div>
    </div>
  );
}
