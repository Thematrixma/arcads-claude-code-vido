import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/utils";

async function getHomeData() {
  const [categories, featuredProducts, foundingSellers] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { status: "APPROVED" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        seller: { select: { id: true, storeName: true, city: true, isFoundingSeller: true } },
        category: { select: { nameAr: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.seller.findMany({
      where: { status: "APPROVED", isFoundingSeller: true },
      take: 6,
    }),
  ]);
  return { categories, featuredProducts, foundingSellers };
}

const categoryIcons: Record<string, string> = {
  perfumes: "🕯️",
  gifts: "🎁",
  abayas: "👗",
};

export default async function HomePage() {
  const { categories, featuredProducts, foundingSellers } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-yellow-50 to-amber-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            اكتشف منتجات سعودية أصيلة
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            عطور، بخور، هدايا يدوية، وعبايات من أمهر الحرفيين السعوديين
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors text-lg"
            >
              تسوق الآن
            </Link>
            <Link
              href="/register?role=seller"
              className="border-2 border-yellow-500 text-yellow-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-50 transition-colors text-lg"
            >
              انضم كبائع
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✅", text: "بائعون معتمدون" },
              { icon: "🔒", text: "دفع آمن" },
              { icon: "🚚", text: "شحن سريع" },
              { icon: "↩️", text: "سياسة إرجاع" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-yellow-200"
              >
                <div className="text-5xl mb-4">{categoryIcons[cat.slug] ?? "🛍️"}</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                  {cat.nameAr}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{cat.nameEn}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">منتجات مميزة</h2>
            <Link href="/products" className="text-yellow-600 text-sm font-medium hover:underline">
              عرض الكل ←
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>سيتم إضافة المنتجات قريباً</p>
            </div>
          )}
        </div>
      </section>

      {/* Founding sellers */}
      {foundingSellers.length > 0 && (
        <section className="py-12 px-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              متاجرنا المؤسسة
            </h2>
            <p className="text-gray-500 text-center mb-8">
              انضموا إلينا في البداية وشكّلوا هوية المنصة
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {foundingSellers.map((seller) => (
                <Link
                  key={seller.id}
                  href={`/stores/${seller.id}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-amber-100"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-yellow-600">
                      {seller.storeName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{seller.storeName}</h3>
                  <p className="text-xs text-gray-400 mt-1">{seller.city}</p>
                  <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                    متجر مؤسس ⭐
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seller CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">هل لديك منتج مميز؟</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            انضم إلى منصتنا وابدأ البيع اليوم. لا رسوم اشتراك، فقط عمولة 10% على الطلبات الناجحة.
          </p>
          <Link
            href="/register?role=seller"
            className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors inline-block"
          >
            ابدأ البيع الآن ←
          </Link>
        </div>
      </section>
    </div>
  );
}
