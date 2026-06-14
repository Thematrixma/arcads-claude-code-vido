import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";

interface Props {
  searchParams: { q?: string; category?: string; page?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;

  const where: Record<string, unknown> = { status: "APPROVED" };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.q) {
    where.OR = [
      { nameAr: { contains: searchParams.q } },
      { descriptionAr: { contains: searchParams.q } },
    ];
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        seller: { select: { id: true, storeName: true, city: true, isFoundingSeller: true } },
        category: { select: { nameAr: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">الفئات</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !searchParams.category
                      ? "bg-yellow-100 text-yellow-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  جميع المنتجات
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchParams.category === cat.slug
                        ? "bg-yellow-100 text-yellow-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {searchParams.q ? `نتائج: "${searchParams.q}"` : "جميع المنتجات"}
            </h1>
            <span className="text-sm text-gray-400">{total} منتج</span>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/products?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm ${
                        page === p
                          ? "bg-yellow-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">لا توجد منتجات</p>
              <p className="text-sm">جرب البحث بكلمات أخرى</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
