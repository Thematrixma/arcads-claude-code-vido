import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { MapPin, Clock, Star, Instagram, Shield } from "lucide-react";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      seller: true,
      category: true,
      reviews: {
        include: { buyer: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product || product.status !== "APPROVED") notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const mainImage = product.images[0]?.imageUrl;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
            {mainImage ? (
              <Image src={mainImage} alt={product.nameAr} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                🛍️
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image src={img.imageUrl} alt={`${product.nameAr} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-yellow-600 mb-1">{product.category.nameAr}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nameAr}</h1>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product._count.reviews} تقييم)</span>
            </div>
          )}

          <div className="text-3xl font-bold text-yellow-600 mb-4">{formatPrice(product.price)}</div>

          <div className="flex gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              التجهيز: {product.preparationTimeDays} أيام
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.stockQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {product.stockQuantity > 0 ? `متوفر (${product.stockQuantity})` : "نفد المخزون"}
            </span>
          </div>

          {product.descriptionAr && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">وصف المنتج</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.descriptionAr}</p>
            </div>
          )}

          {product.stockQuantity > 0 && (
            <AddToCartButton productId={product.id} />
          )}

          {/* Seller info */}
          <div className="mt-6 border-t pt-4">
            <Link href={`/stores/${product.seller.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-lg">
                  {product.seller.storeName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{product.seller.storeName}</span>
                  {product.seller.isFoundingSeller && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">مؤسس</span>
                  )}
                </div>
                {product.seller.city && (
                  <span className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {product.seller.city}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-4 bg-green-50 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700">
            <Shield className="w-4 h-4" />
            <span>بائع معتمد من المنصة — محمي بسياسة حماية المشترين</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            تقييمات المشترين ({product._count.reviews})
          </h2>
          <div className="grid gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.buyer.fullName}</span>
                </div>
                {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
