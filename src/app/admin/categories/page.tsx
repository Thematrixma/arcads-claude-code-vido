"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ nameAr: "", nameEn: "", slug: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, { ...cat, _count: { products: 0 } }]);
      setForm({ nameAr: "", nameEn: "", slug: "" });
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الفئات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">إضافة فئة جديدة</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              placeholder="الاسم بالعربي *"
              required
            />
            <input
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              placeholder="English Name"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              placeholder="slug-en (e.g. perfumes)"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50"
            >
              إضافة
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-right text-gray-600">الفئة</th>
                <th className="p-3 text-right text-gray-600">المنتجات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-3">
                    <p className="font-medium text-gray-900">{cat.nameAr}</p>
                    <p className="text-xs text-gray-400">{cat.slug}</p>
                  </td>
                  <td className="p-3 text-gray-500">{cat._count.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
