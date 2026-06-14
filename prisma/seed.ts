import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@marketplace.sa" },
    update: {},
    create: {
      fullName: "مدير المنصة",
      email: "admin@marketplace.sa",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin created:", admin.email);

  // Categories
  const cat1 = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: {},
    create: {
      nameAr: "العطور والبخور",
      nameEn: "Perfumes & Oud",
      slug: "perfumes",
      imageUrl: "/images/categories/perfumes.jpg",
    },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: "gifts" },
    update: {},
    create: {
      nameAr: "الهدايا اليدوية",
      nameEn: "Handmade Gifts",
      slug: "gifts",
      imageUrl: "/images/categories/gifts.jpg",
    },
  });

  const cat3 = await prisma.category.upsert({
    where: { slug: "abayas" },
    update: {},
    create: {
      nameAr: "العبايات والإكسسوارات",
      nameEn: "Abayas & Accessories",
      slug: "abayas",
      imageUrl: "/images/categories/abayas.jpg",
    },
  });
  console.log("✓ Categories created");

  // Seller 1
  const seller1Password = await bcrypt.hash("seller123", 10);
  const seller1User = await prisma.user.upsert({
    where: { email: "seller1@marketplace.sa" },
    update: {},
    create: {
      fullName: "أم خالد",
      email: "seller1@marketplace.sa",
      password: seller1Password,
      phone: "0501234567",
      role: "SELLER",
    },
  });

  const seller1 = await prisma.seller.upsert({
    where: { userId: seller1User.id },
    update: {},
    create: {
      userId: seller1User.id,
      storeName: "بيت العطور الأصيل",
      storeDescription: "عطور ومكيافات يدوية أصيلة بلمسة سعودية",
      city: "الرياض",
      whatsappNumber: "0501234567",
      instagramUrl: "https://instagram.com/store1",
      status: "APPROVED",
      isFoundingSeller: true,
    },
  });

  // Seller 2
  const seller2Password = await bcrypt.hash("seller123", 10);
  const seller2User = await prisma.user.upsert({
    where: { email: "seller2@marketplace.sa" },
    update: {},
    create: {
      fullName: "نورة الشمري",
      email: "seller2@marketplace.sa",
      password: seller2Password,
      phone: "0559876543",
      role: "SELLER",
    },
  });

  const seller2 = await prisma.seller.upsert({
    where: { userId: seller2User.id },
    update: {},
    create: {
      userId: seller2User.id,
      storeName: "لمسة إبداع",
      storeDescription: "هدايا يدوية وتوزيعات مميزة لكل المناسبات",
      city: "جدة",
      whatsappNumber: "0559876543",
      instagramUrl: "https://instagram.com/store2",
      status: "APPROVED",
      isFoundingSeller: true,
    },
  });
  console.log("✓ Sellers created");

  // Products for seller1
  const p1 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      categoryId: cat1.id,
      nameAr: "عود الملكي الخاص",
      nameEn: "Royal Oud Special",
      descriptionAr: "عود فاخر من أجود أنواع الكمبودي، رائحة عميقة ومميزة تدوم طويلاً",
      price: 350,
      stockQuantity: 20,
      preparationTimeDays: 2,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p1.id, imageUrl: "/images/products/oud1.jpg", sortOrder: 0 },
  });

  const p2 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      categoryId: cat1.id,
      nameAr: "بخور دلة العرب",
      nameEn: "Dallah Arab Bakhoor",
      descriptionAr: "بخور فاخر مصنوع يدوياً بأفضل الخامات العربية الأصيلة",
      price: 120,
      stockQuantity: 50,
      preparationTimeDays: 1,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p2.id, imageUrl: "/images/products/bakhoor1.jpg", sortOrder: 0 },
  });

  const p3 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      categoryId: cat1.id,
      nameAr: "عطر الورد السعودي",
      nameEn: "Saudi Rose Perfume",
      descriptionAr: "عطر الورد الطائفي الأصيل في زجاجة فاخرة مناسبة للهدايا",
      price: 280,
      stockQuantity: 15,
      preparationTimeDays: 3,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p3.id, imageUrl: "/images/products/rose-perfume.jpg", sortOrder: 0 },
  });

  // Products for seller2
  const p4 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      categoryId: cat2.id,
      nameAr: "طقم توزيعات زواج فاخر",
      nameEn: "Luxury Wedding Giveaway Set",
      descriptionAr: "طقم توزيعات زفاف مميز يحتوي على شموع وعطور وزينة يدوية",
      price: 85,
      stockQuantity: 100,
      preparationTimeDays: 5,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p4.id, imageUrl: "/images/products/wedding-gift.jpg", sortOrder: 0 },
  });

  const p5 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      categoryId: cat2.id,
      nameAr: "هدية مولود ذهبية",
      nameEn: "Golden Baby Gift",
      descriptionAr: "هدية مولود فاخرة مزينة بالذهبي تحتوي على ملابس وإكسسوارات",
      price: 199,
      stockQuantity: 30,
      preparationTimeDays: 3,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p5.id, imageUrl: "/images/products/baby-gift.jpg", sortOrder: 0 },
  });

  const p6 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      categoryId: cat3.id,
      nameAr: "عباية الفراشة المطرزة",
      nameEn: "Embroidered Butterfly Abaya",
      descriptionAr: "عباية أنيقة بتطريز يدوي مميز، قماش فاخر مستورد",
      price: 650,
      stockQuantity: 10,
      preparationTimeDays: 7,
      status: "APPROVED",
    },
  });
  await prisma.productImage.create({
    data: { productId: p6.id, imageUrl: "/images/products/abaya1.jpg", sortOrder: 0 },
  });

  console.log("✓ Products created");
  console.log("\n✅ Seed completed successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin:  admin@marketplace.sa / admin123");
  console.log("  Seller: seller1@marketplace.sa / seller123");
  console.log("  Seller: seller2@marketplace.sa / seller123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
