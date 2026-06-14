"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("role") === "seller";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    storeName: "",
    city: "",
    whatsappNumber: "",
    instagramUrl: "",
    storeDescription: "",
    asSeller: isSeller,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = form.asSeller ? "/api/sellers" : "/api/users";
    const body = form.asSeller
      ? form
      : { fullName: form.fullName, email: form.email, password: form.password, phone: form.phone };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "حدث خطأ، حاول مجدداً");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push(form.asSeller ? "/seller/dashboard" : "/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        {form.asSeller ? "سجّل متجرك" : "إنشاء حساب"}
      </h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        {form.asSeller ? "انضم كبائع مؤسس — مجاناً" : "ابدأ التسوق في سوق الأصيل"}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Seller toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="asSeller"
            checked={form.asSeller}
            onChange={handleChange}
            className="w-4 h-4 accent-yellow-500"
          />
          <span className="text-sm text-gray-700">أريد التسجيل كبائع</span>
        </label>

        {form.asSeller && (
          <div className="space-y-4 border-t pt-4">
            <p className="text-sm font-medium text-yellow-700">بيانات المتجر</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر *</label>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                required={form.asSeller}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">واتساب</label>
              <input
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حساب انستغرام</label>
              <input
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                placeholder="https://instagram.com/yourstore"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
              <textarea
                name="storeDescription"
                value={form.storeDescription}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 resize-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "جارٍ التسجيل..." : form.asSeller ? "سجّل المتجر" : "إنشاء الحساب"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        لديك حساب؟{" "}
        <Link href="/login" className="text-yellow-600 font-medium hover:underline">
          دخول
        </Link>
      </p>
    </div>
  );
}
