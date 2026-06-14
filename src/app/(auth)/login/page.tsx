"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } else {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/";
      router.push(callbackUrl);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">تسجيل الدخول</h1>
      <p className="text-gray-500 text-sm text-center mb-6">مرحباً بك في سوق الأصيل</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-yellow-600 font-medium hover:underline">
          سجّل الآن
        </Link>
      </p>

      <div className="mt-4 pt-4 border-t text-center text-xs text-gray-400">
        <p>للتجربة: admin@marketplace.sa / admin123</p>
      </div>
    </div>
  );
}
