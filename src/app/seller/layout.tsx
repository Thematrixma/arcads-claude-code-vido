import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "SELLER" && role !== "ADMIN") redirect("/");

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm p-3 space-y-1">
            <p className="text-xs text-gray-400 px-3 py-1 font-medium">لوحة البائع</p>
            <Link href="/seller/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">
              الرئيسية
            </Link>
            <Link href="/seller/products" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">
              منتجاتي
            </Link>
            <Link href="/seller/products/new" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">
              إضافة منتج
            </Link>
            <Link href="/seller/orders" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">
              الطلبات
            </Link>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
