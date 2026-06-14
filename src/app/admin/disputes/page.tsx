import { prisma } from "@/lib/prisma";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    include: {
      order: { select: { orderNumber: true } },
      buyer: { select: { fullName: true } },
      seller: { select: { storeName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">النزاعات ({disputes.length})</h1>

      {disputes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm text-gray-400">
          لا توجد نزاعات
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">طلب: {d.order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {d.buyer.fullName} ← {d.seller.storeName}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(d.status)}`}>
                  {getStatusLabel(d.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{d.reason}</p>
              {d.adminNotes && (
                <p className="text-xs text-gray-400 mt-2 border-t pt-2">
                  ملاحظة الإدارة: {d.adminNotes}
                </p>
              )}
              <p className="text-xs text-gray-300 mt-2">
                {new Date(d.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
