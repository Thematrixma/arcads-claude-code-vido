"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const role = (session?.user as { role?: string })?.role;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">س</span>
            </div>
            <span className="text-xl font-bold text-gray-900">سوق الأصيل</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                placeholder="ابحث عن منتجات..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:border-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/products" className="text-sm text-gray-600 hover:text-yellow-600">
              المنتجات
            </Link>
            {session ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-yellow-600" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600">
                    <User className="h-5 w-5" />
                    <span>{session.user?.name?.split(" ")[0]}</span>
                  </button>
                  <div className="absolute left-0 top-8 bg-white shadow-lg rounded-lg py-2 w-44 hidden group-hover:block z-50">
                    {role === "ADMIN" && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        لوحة الإدارة
                      </Link>
                    )}
                    {role === "SELLER" && (
                      <Link href="/seller/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        لوحة البائع
                      </Link>
                    )}
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      طلباتي
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-yellow-600"
                >
                  دخول
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                >
                  تسجيل
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-3">
              <input
                type="text"
                placeholder="ابحث عن منتجات..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/products" className="py-2 text-gray-700">المنتجات</Link>
              {session ? (
                <>
                  <Link href="/cart" className="py-2 text-gray-700">السلة</Link>
                  <Link href="/orders" className="py-2 text-gray-700">طلباتي</Link>
                  {role === "SELLER" && (
                    <Link href="/seller/dashboard" className="py-2 text-gray-700">لوحة البائع</Link>
                  )}
                  {role === "ADMIN" && (
                    <Link href="/admin/dashboard" className="py-2 text-gray-700">لوحة الإدارة</Link>
                  )}
                  <button onClick={() => signOut()} className="py-2 text-red-600 text-right">
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="py-2 text-gray-700">دخول</Link>
                  <Link href="/register" className="py-2 text-yellow-600">تسجيل</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
