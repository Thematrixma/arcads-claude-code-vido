import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">س</span>
              </div>
              <span className="text-white font-bold text-lg">سوق الأصيل</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة سعودية متخصصة في المنتجات المحلية الأصيلة من العطور والهدايا اليدوية والعبايات
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">التسوق</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-yellow-400">جميع المنتجات</Link></li>
              <li><Link href="/categories/perfumes" className="hover:text-yellow-400">العطور والبخور</Link></li>
              <li><Link href="/categories/gifts" className="hover:text-yellow-400">الهدايا اليدوية</Link></li>
              <li><Link href="/categories/abayas" className="hover:text-yellow-400">العبايات والإكسسوارات</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">للبائعين</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register?role=seller" className="hover:text-yellow-400">انضم كبائع مؤسس</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-yellow-400">لوحة تحكم البائع</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-yellow-400">سياسة الإرجاع</Link></li>
              <li><Link href="#" className="hover:text-yellow-400">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="hover:text-yellow-400">الشروط والأحكام</Link></li>
              <li>
                <a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  تواصل معنا عبر واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} سوق الأصيل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
