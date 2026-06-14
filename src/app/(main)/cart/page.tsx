"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  product: {
    id: string;
    nameAr: string;
    images: { imageUrl: string }[];
    seller: { storeName: string };
    stockQuantity: number;
  };
}

interface Cart {
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setCart(data);
    }
    setLoading(false);
  }

  async function updateQuantity(itemId: string, quantity: number) {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    fetchCart();
  }

  async function removeItem(itemId: string) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    fetchCart();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
        جارٍ التحميل...
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.priceAtTime * i.quantity, 0);
  const shippingFee = items.length > 0 ? 25 : 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">السلة فارغة</h1>
        <p className="text-gray-400 mb-6">لم تضف أي منتجات بعد</p>
        <Link
          href="/products"
          className="bg-yellow-500 text-white px-6 py-2.5 rounded-full hover:bg-yellow-600 transition-colors"
        >
          تسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">سلة التسوق ({items.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.nameAr}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {item.product.nameAr}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.product.seller.storeName}</p>
                <p className="text-yellow-600 font-bold mt-1">{formatPrice(item.priceAtTime)}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 border rounded-full px-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:text-yellow-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:text-yellow-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
          <h2 className="font-bold text-gray-900 mb-4">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>رسوم الشحن</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900">
              <span>الإجمالي</span>
              <span className="text-yellow-600">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-full font-bold hover:bg-yellow-600 transition-colors"
          >
            إتمام الطلب
          </button>
          <Link
            href="/products"
            className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            ← متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
