import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">س</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">سوق الأصيل</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
