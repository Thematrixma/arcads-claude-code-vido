export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

export interface ProductWithDetails {
  id: string;
  nameAr: string;
  nameEn?: string | null;
  descriptionAr?: string | null;
  price: number;
  stockQuantity: number;
  preparationTimeDays: number;
  status: string;
  createdAt: Date;
  images: { imageUrl: string; sortOrder: number }[];
  seller: {
    id: string;
    storeName: string;
    city?: string | null;
    isFoundingSeller: boolean;
  };
  category: {
    nameAr: string;
    slug: string;
  };
  _count?: {
    reviews: number;
  };
}
