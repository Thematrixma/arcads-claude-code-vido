import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import { Plus } from "lucide-react";

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) redirect("/");

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    include: { images: { take: 1 }, category: { select: { nameAr: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">منتجاتي ({products.length})</h1>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-600"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-400 mb-4">لم تضف أي منتجات بعد</p>
          <Link href="/seller/products/new" className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600">
            أضف منتجك الأول
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-right">المنتج</th>
                <th className="p-3 text-right">الفئة</th>
                <th className="p-3 text-right">السعر</th>
                <th className="p-3 text-right">المخزون</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0].imageUrl} alt={p.nameAr} width={40} height={40} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base">🛍️</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">{p.nameAr}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">{p.category.nameAr}</td>
                  <td className="p-3 font-medium text-yellow-600">{formatPrice(p.price)}</td>
                  <td className="p-3 text-gray-700">{p.stockQuantity}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(p.status)}`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/seller/products/${p.id}/edit`}
                      className="text-yellow-600 text-xs hover:underline"
                    >
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
