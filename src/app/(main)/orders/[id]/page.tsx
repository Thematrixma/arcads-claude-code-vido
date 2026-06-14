import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { success?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
          seller: { select: { storeName: true, id: true } },
        },
      },
      payment: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-bold text-green-800">تم تأكيد طلبك بنجاح!</p>
            <p className="text-sm text-green-600">سيتم التواصل معك لإتمام عملية الدفع</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">طلب #{order.orderNumber}</h1>
          <p className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm mb-4">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-900">المنتجات</h2>
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="p-4 flex gap-3 border-b last:border-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0].imageUrl}
                  alt={item.product.nameAr}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{item.product.nameAr}</p>
              <p className="text-xs text-gray-400">{item.seller.storeName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </p>
            </div>
            <div className="font-bold text-yellow-600 text-sm">
              {formatPrice(item.totalPrice)}
            </div>
          </div>
        ))}
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">عنوان التسليم</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{order.shippingAddress}</p>
          <p>{order.city}</p>
          <p>{order.phone}</p>
          {order.notes && <p className="text-gray-400">ملاحظة: {order.notes}</p>}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-gray-900 mb-3">ملخص الطلب</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>رسوم الشحن</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
            <span>الإجمالي</span>
            <span className="text-yellow-600 text-lg">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/orders" className="text-sm text-gray-500 hover:text-gray-700">
          ← العودة لجميع الطلبات
        </Link>
      </div>
    </div>
  );
}
