import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, status: "APPROVED" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      seller: { select: { id: true, storeName: true, city: true, isFoundingSeller: true } },
      category: { select: { nameAr: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{category.nameAr}</h1>
        <p className="text-gray-500 text-sm mt-1">{products.length} منتج</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>لا توجد منتجات في هذه الفئة بعد</p>
        </div>
      )}
    </div>
  );
}
