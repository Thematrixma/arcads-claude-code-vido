"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";

export function AddToCartButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading || added}
      className={`w-full py-3 px-6 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all ${
        added
          ? "bg-green-500 text-white"
          : "bg-yellow-500 text-white hover:bg-yellow-600"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          تمت الإضافة للسلة
        </>
      ) : loading ? (
        "جارٍ الإضافة..."
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          أضف إلى السلة
        </>
      )}
    </button>
  );
}
