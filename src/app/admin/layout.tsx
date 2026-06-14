import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm p-3 space-y-1">
            <p className="text-xs text-gray-400 px-3 py-1 font-medium">الإدارة</p>
            <Link href="/admin/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              الرئيسية
            </Link>
            <Link href="/admin/sellers" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              البائعون
            </Link>
            <Link href="/admin/products" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              المنتجات
            </Link>
            <Link href="/admin/orders" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              الطلبات
            </Link>
            <Link href="/admin/categories" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              الفئات
            </Link>
            <Link href="/admin/disputes" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              النزاعات
            </Link>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
