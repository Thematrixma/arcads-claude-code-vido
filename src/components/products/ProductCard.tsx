import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    nameAr: string;
    price: number;
    preparationTimeDays: number;
    images: { imageUrl: string }[];
    seller: {
      id: string;
      storeName: string;
      city?: string | null;
      isFoundingSeller: boolean;
    };
    category: { nameAr: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.imageUrl;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.nameAr}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z" />
              </svg>
            </div>
          )}
          {product.seller.isFoundingSeller && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              مؤسس
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-400 mb-1">{product.category.nameAr}</p>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
            {product.nameAr}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-600 font-bold text-base">{formatPrice(product.price)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {product.seller.city ?? "السعودية"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {product.preparationTimeDays} أيام
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-50">
            <p className="text-xs text-gray-500">{product.seller.storeName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
