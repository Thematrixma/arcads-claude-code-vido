import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { MapPin, Instagram } from "lucide-react";
import Link from "next/link";

export default async function StorePage({ params }: { params: { id: string } }) {
  const seller = await prisma.seller.findUnique({
    where: { id: params.id },
    include: {
      products: {
        where: { status: "APPROVED" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { nameAr: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!seller || seller.status !== "APPROVED") notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Store header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-yellow-600">
              {seller.storeName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
              {seller.isFoundingSeller && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
                  متجر مؤسس ⭐
                </span>
              )}
            </div>
            {seller.city && (
              <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
                <MapPin className="w-4 h-4" />
                {seller.city}
              </p>
            )}
            {seller.storeDescription && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {seller.storeDescription}
              </p>
            )}
            <div className="flex gap-3 mt-3">
              {seller.instagramUrl && (
                <a
                  href={seller.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{seller.products.length}</div>
            <div className="text-xs text-gray-400">منتج</div>
          </div>
        </div>
      </div>

      {/* Products */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">منتجات المتجر</h2>
      {seller.products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {seller.products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                ...p,
                seller: {
                  id: seller.id,
                  storeName: seller.storeName,
                  city: seller.city,
                  isFoundingSeller: seller.isFoundingSeller,
                },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p>لا توجد منتجات بعد</p>
        </div>
      )}
    </div>
  );
}
