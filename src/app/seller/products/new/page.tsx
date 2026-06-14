"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  nameAr: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nameAr: "",
    descriptionAr: "",
    price: "",
    stockQuantity: "10",
    preparationTimeDays: "3",
    categoryId: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: imageUrls.filter(Boolean),
      }),
    });

    if (res.ok) {
      router.push("/seller/products");
    } else {
      const data = await res.json();
      setError(data.error ?? "حدث خطأ");
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة منتج جديد</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (عربي) *</label>
          <input
            name="nameAr"
            value={form.nameAr}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
          <textarea
            name="descriptionAr"
            value={form.descriptionAr}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ر.س) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المتاحة</label>
            <input
              name="stockQuantity"
              type="number"
              value={form.stockQuantity}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وقت التجهيز (أيام)</label>
            <input
              name="preparationTimeDays"
              type="number"
              value={form.preparationTimeDays}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الفئة *</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">روابط الصور</label>
          <p className="text-xs text-gray-400 mb-2">أدخل رابط URL لكل صورة (يمكنك رفعها على Imgur أو Cloudinary)</p>
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={url}
                onChange={(e) => {
                  const updated = [...imageUrls];
                  updated[i] = e.target.value;
                  setImageUrls(updated);
                }}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
                placeholder="https://example.com/image.jpg"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {imageUrls.length < 5 && (
            <button
              type="button"
              onClick={() => setImageUrls([...imageUrls, ""])}
              className="text-yellow-600 text-sm hover:underline"
            >
              + إضافة صورة
            </button>
          )}
        </div>

        <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-700">
          سيتم مراجعة المنتج من قِبل الإدارة قبل نشره في المنصة
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}
