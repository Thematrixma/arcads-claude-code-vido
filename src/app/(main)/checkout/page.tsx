"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    shippingAddress: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then((data) => {
      const subtotal = (data.items ?? []).reduce(
        (s: number, i: { priceAtTime: number; quantity: number }) => s + i.priceAtTime * i.quantity,
        0
      );
      setCartTotal(subtotal);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingFee: 25,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        router.push(`/orders/${order.id}?success=1`);
      }
    } finally {
      setLoading(false);
    }
  }

  const shippingFee = 25;
  const total = cartTotal + shippingFee;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إتمام الطلب</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["عنوان التسليم", "مراجعة الطلب", "تأكيد الدفع"].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-400"
            }`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${step === i + 1 ? "font-medium text-gray-900" : "text-gray-400"}`}>
              {s}
            </span>
            {i < 2 && <div className="h-px w-8 bg-gray-200 flex-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">عنوان التسليم</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                    placeholder="محمد العمري"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المدينة *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                    placeholder="الرياض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحي</label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                    placeholder="حي النزهة"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان التفصيلي *</label>
                  <input
                    name="shippingAddress"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
                    placeholder="شارع الأمير محمد، بناية ٣، شقة ١٠"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات للتوصيل</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 resize-none"
                    placeholder="أي تعليمات خاصة للتوصيل..."
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.fullName || !form.phone || !form.city || !form.shippingAddress}
                className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                التالي: مراجعة الطلب →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">مراجعة بيانات التوصيل</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">الاسم:</span>
                  <span className="font-medium">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الجوال:</span>
                  <span className="font-medium">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المدينة:</span>
                  <span className="font-medium">{form.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">العنوان:</span>
                  <span className="font-medium">{form.shippingAddress}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-50">
                  تعديل
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600">
                  التالي →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">طريقة الدفع</h2>
              <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">تحويل بنكي</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      سيتم إرسال تفاصيل التحويل بعد تأكيد الطلب
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 mb-4">
                سيتم تأكيد طلبك وإخطار البائع بعد التحقق من الدفع خلال ٢٤ ساعة
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-50">
                  السابق
                </button>
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 disabled:opacity-50"
                >
                  {loading ? "جارٍ التأكيد..." : "تأكيد الطلب ✓"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
          <h2 className="font-bold text-gray-900 mb-4">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>رسوم الشحن</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900">
              <span>الإجمالي</span>
              <span className="text-yellow-600 text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
