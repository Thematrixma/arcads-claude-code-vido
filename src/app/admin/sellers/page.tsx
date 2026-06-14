"use client";

import { useEffect, useState } from "react";
import { getStatusLabel, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface Seller {
  id: string;
  storeName: string;
  city: string;
  status: string;
  isFoundingSeller: boolean;
  commissionRate: number;
  createdAt: string;
  user: { fullName: string; email: string; phone: string };
  _count: { products: number; orderItems: number };
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/sellers").then((r) => r.json()).then((data) => {
      setSellers(data);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/sellers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSellers(sellers.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  const filtered = filter === "all" ? sellers : sellers.filter((s) => s.status === filter);

  if (loading) return <div className="text-gray-400 text-center py-12">جارٍ التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">البائعون ({sellers.length})</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              filter === s ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "الكل" : getStatusLabel(s)}
            {s !== "all" && (
              <span className="mr-1 text-xs">({sellers.filter((x) => x.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-right">المتجر</th>
              <th className="p-3 text-right">المدينة</th>
              <th className="p-3 text-right">المنتجات</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-medium text-gray-900">{seller.storeName}</p>
                  <p className="text-xs text-gray-400">{seller.user.email}</p>
                </td>
                <td className="p-3 text-gray-500">{seller.city}</td>
                <td className="p-3 text-gray-700">{seller._count.products}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(seller.status)}`}>
                    {getStatusLabel(seller.status)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {seller.status !== "APPROVED" && (
                      <button
                        onClick={() => updateStatus(seller.id, "APPROVED")}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        قبول
                      </button>
                    )}
                    {seller.status !== "REJECTED" && (
                      <button
                        onClick={() => updateStatus(seller.id, "REJECTED")}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        رفض
                      </button>
                    )}
                    {seller.status !== "SUSPENDED" && (
                      <button
                        onClick={() => updateStatus(seller.id, "SUSPENDED")}
                        className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        تعليق
                      </button>
                    )}
                    <Link
                      href={`/stores/${seller.id}`}
                      className="text-xs text-yellow-600 px-2 py-1 rounded hover:underline"
                      target="_blank"
                    >
                      عرض
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">لا توجد نتائج</div>
        )}
      </div>
    </div>
  );
}
