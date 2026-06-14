export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-SA")} ر.س`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "قيد الانتظار",
    APPROVED: "مقبول",
    REJECTED: "مرفوض",
    SUSPENDED: "موقوف",
    DRAFT: "مسودة",
    PENDING_REVIEW: "قيد المراجعة",
    INACTIVE: "غير نشط",
    PENDING_PAYMENT: "بانتظار الدفع",
    PAID: "مدفوع",
    CONFIRMED: "مؤكد",
    PROCESSING: "قيد التجهيز",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التسليم",
    CANCELLED: "ملغي",
    REFUNDED: "مسترد",
    DISPUTED: "متنازع عليه",
    NEW: "جديد",
    ACCEPTED: "مقبول",
    PREPARING: "قيد التجهيز",
    OPEN: "مفتوح",
    UNDER_REVIEW: "قيد المراجعة",
    RESOLVED: "محلول",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800",
    PAID: "bg-green-100 text-green-800",
    DELIVERED: "bg-green-100 text-green-800",
    RESOLVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-red-100 text-red-800",
    SUSPENDED: "bg-red-100 text-red-800",
    DISPUTED: "bg-orange-100 text-orange-800",
    DRAFT: "bg-gray-100 text-gray-800",
    INACTIVE: "bg-gray-100 text-gray-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}
