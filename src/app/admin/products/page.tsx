"use client";

import { useEffect, useState } from "react";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  nameAr: string;
  price: number;
  status: string;
  createdAt: string;
  images: { imageUrl: string }[];
  seller: { storeName: string };
  category: { nameAr: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING_REVIEW");

  useEffect(() => {
    const url = filter === "all" ? "/api/products?status=all&limit=100" : `/api/products?status=${filter}&limit=100`;
    fetch(url).then((r) => r.json()).then((data) => {
      setProducts(data.products ?? []);
      setLoading(false);
    });
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setProducts(products.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  if (loading) return <div className="text-gray-400 text-center py-12">جارٍ التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">المنتجات</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["PENDING_REVIEW", "APPROVED", "REJECTED", "INACTIVE"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              filter === s ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {getStatusLabel(s)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-right">المنتج</th>
              <th className="p-3 text-right">البائع</th>
              <th className="p-3 text-right">السعر</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">إجراءات</th>
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
                        <div className="w-full h-full flex items-center justify-center">🛍️</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.nameAr}</p>
                      <p className="text-xs text-gray-400">{p.category.nameAr}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-500">{p.seller.storeName}</td>
                <td className="p-3 font-medium text-yellow-600">{formatPrice(p.price)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(p.status)}`}>
                    {getStatusLabel(p.status)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {p.status !== "APPROVED" && (
                      <button
                        onClick={() => updateStatus(p.id, "APPROVED")}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        قبول
                      </button>
                    )}
                    {p.status !== "REJECTED" && (
                      <button
                        onClick={() => updateStatus(p.id, "REJECTED")}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        رفض
                      </button>
                    )}
                    <Link href={`/products/${p.id}`} target="_blank" className="text-xs text-yellow-600 px-2 py-1 rounded hover:underline">
                      عرض
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-400">لا توجد منتجات في هذه الحالة</div>
        )}
      </div>
    </div>
  );
}
