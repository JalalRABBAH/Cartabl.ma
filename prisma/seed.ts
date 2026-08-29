import { PrismaClient, ProductCategory, Role, OrderStatus } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function trackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CM-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function orderNumber(): string {
  const n = 1000 + Math.floor(Math.random() * 9000);
  return `CMD-${new Date().getFullYear()}-${n}`;
}

type ProductSeed = {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: ProductCategory;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  colors: string[];
  level?: string;
  featured?: boolean;
  sold?: number;
};

const products: ProductSeed[] = [
  {
    slug: "cartable-panda-roux",
    name: "Cartable Panda Roux",
    nameAr: "حقيبة الباندا",
    description:
      "Cartable souple et léger avec motif panda, bretelles rembourrées et fermeture zippée. Parfait pour la primaire (1ère à 4ème année).",
    descriptionAr:
      "حقيبة مدرسية ناعمة وخفيفة بنقشة الباندا، بأحزمة مبطنة وإغلاق بسحاب. مثالية للتعليم الابتدائي.",
    category: ProductCategory.CLASSIQUE,
    brand: "Zitouna Kids",
    price: 249,
    compareAtPrice: 329,
    stock: 34,
    colors: ["#e11d48", "#3b82f6", "#f59e0b", "#10b981"],
    level: "primaire",
    featured: true,
    sold: 132,
  },
  {
    slug: "cartable-licorne",
    name: "Cartable Licorne Magique",
    nameAr: "حقيبة يونيكورن السحرية",
    description:
      "Cartable brillant au design licorne avec poche avant, organisateur intérieur et matière imperméable. Cadeau idéal pour les petites filles.",
    descriptionAr:
      "حقيبة لامعة بتصميم يونيكورن مع جيب أمامي ومنظم داخلي وخامة مقاومة للماء. هدية مثالية للفتيات الصغيرات.",
    category: ProductCategory.CLASSIQUE,
    brand: "Soukina",
    price: 269,
    stock: 21,
    colors: ["#ec4899", "#8b5cf6", "#f472b6", "#a855f7"],
    level: "primaire",
    featured: true,
    sold: 98,
  },
  {
    slug: "cartable-dino-junior",
    name: "Cartable Dino Junior",
    nameAr: "حقيبة الديناصور جونيور",
    description:
      "Le compagnon des aventuriers ! Cartable robuste à motif dinosaure, dos renforcé et grande contenance. Idéal pour maternelle et CP.",
    descriptionAr:
      "رفيق المغامرين! حقيبة متينة بنقشة الديناصور، ظهر مقوى وسعة كبيرة. مثالية لرياض الأطفال والابتدائي.",
    category: ProductCategory.CLASSIQUE,
    brand: "Atlas Kids",
    price: 229,
    compareAtPrice: 279,
    stock: 42,
    colors: ["#22c55e", "#84cc16", "#10b981", "#16a34a"],
    level: "primaire",
    sold: 77,
  },
  {
    slug: "cartable-formule-1",
    name: "Cartable Formule 1",
    nameAr: "حقيبة الفورمولا 1",
    description:
      "Pour les passionnés de course ! Design sportif, bretelles ergonomiques et poche pour la gourde. Cartable primaire nouvelle génération.",
    descriptionAr:
      "لعشاق السباقات! تصميم رياضي، أحزمة مريحة وجيب للقارورة. حقيبة ابتدائية من الجيل الجديد.",
    category: ProductCategory.CLASSIQUE,
    brand: "Atlas Kids",
    price: 259,
    stock: 18,
    colors: ["#ef4444", "#0ea5e9", "#111827", "#f97316"],
    level: "primaire",
    sold: 64,
  },
  {
    slug: "sac-dos-ergo-22l",
    name: "Sac à dos Ergo Comfort 22L",
    nameAr: "حقيبة ظهر إرغو كومفورت",
    description:
      "Sac à dos ergonomique 22 litres, dos ventilé, compartiment ordinateur 13 pouces et tissu anti-déchirure. Le confort pour le collège.",
    descriptionAr:
      "حقيبة ظهر مريحة بسعة 22 لتراً، ظهر مهوى، جيب للحاسوب مقاس 13 بوصة ونسيج مقاوم للتمزق. الراحة للثانوية الإعدادية.",
    category: ProductCategory.DOS,
    brand: "Kadouri Sport",
    price: 349,
    compareAtPrice: 429,
    stock: 26,
    colors: ["#1d4ed8", "#111827", "#dc2626", "#475569"],
    level: "college",
    featured: true,
    sold: 156,
  },
  {
    slug: "sac-dos-ville-casablanca",
    name: "Sac à dos Casablanca",
    nameAr: "حقيبة ظهر الدار البيضاء",
    description:
      "Sac urbain élégant avec broderie Casa, finitions en similicuir et grande poche avant. Parfait pour les étudiants et citadins.",
    descriptionAr:
      "حقيبة أنيقة بتطريز كازا، لمسات جلد صناعي وجيب أمامي كبير. مثالية للطلاب وسكان المدن.",
    category: ProductCategory.DOS,
    brand: "Kenza Bags",
    price: 289,
    stock: 30,
    colors: ["#7c2d12", "#334155", "#0f766e", "#4b5563"],
    level: "universite",
    sold: 88,
  },
  {
    slug: "sac-dos-vintage-cuir",
    name: "Sac à dos Vintage Cuir",
    nameAr: "حقيبة ظهر كلاسيكية من الجلد",
    description:
      "Sac à dos en similicuir avec boucle en laiton, intérieur doublé et port USB. Le style intemporel pour les adultes et les parents.",
    descriptionAr:
      "حقيبة ظهر من الجلد الصناعي بإبزيم نحاسي، داخل مبطن ومنفذ USB. أناقة خالدة للكبار والآباء.",
    category: ProductCategory.DOS,
    brand: "Kenza Bags",
    price: 499,
    compareAtPrice: 599,
    stock: 12,
    colors: ["#78350f", "#44403c", "#1f2937", "#57534e"],
    level: "universite",
    featured: true,
    sold: 45,
  },
  {
    slug: "sac-dos-leger-primaire",
    name: "Sac à dos Léger Primaire",
    nameAr: "حقيبة ظهر خفيفة للابتدائي",
    description:
      "Ultra léger (390g) pour préserver le dos des plus petits. Couleurs vives, matériau lavable et bretelles ajustables.",
    descriptionAr:
      "خفيفة للغاية (390غ) للحفاظ على ظهر الصغار. ألوان زاهية، خامة قابلة للغسل وأحزمة قابلة للتعديل.",
    category: ProductCategory.DOS,
    brand: "Zitouna Kids",
    price: 199,
    compareAtPrice: 239,
    stock: 48,
    colors: ["#0ea5e9", "#f43f5e", "#a3e635", "#eab308"],
    level: "primaire",
    sold: 120,
  },
  {
    slug: "cartable-roulettes-maxi",
    name: "Cartable à roulettes Maxi 18L",
    nameAr: "حقيبة بعجلات ماكسي 18 لتراً",
    description:
      "Cartable à roulettes 18 litres avec anse télescopique, poignées rembourrées et base renforcée. Adopté par les enfants des grandes villes.",
    descriptionAr:
      "حقيبة بعجلات بسعة 18 لتراً بمقبض قابل للسحب، مقابض مبطنة وقاعدة مقواة. محبوبة لدى أطفال المدن الكبرى.",
    category: ProductCategory.ROULETTES,
    brand: "Rif Traveller",
    price: 449,
    compareAtPrice: 549,
    stock: 15,
    colors: ["#f43f5e", "#3b82f6", "#8b5cf6", "#14b8a6"],
    level: "college",
    featured: true,
    sold: 71,
  },
  {
    slug: "cartable-roulettes-4-roues",
    name: "Cartable Kids 4 Roues",
    nameAr: "حقيبة كيدز بأربع عجلات",
    description:
      "Cartable à 4 roues multidirectionnelles, très stable et facile à tirer. Compartiments colorés et poche thermos.",
    descriptionAr:
      "حقيبة بأربع عجلات متعددة الاتجاهات، ثابتة جداً وسهلة السحب. جيوب ملونة وجيب للحافظة.",
    category: ProductCategory.ROULETTES,
    brand: "Soukina",
    price: 419,
    stock: 11,
    colors: ["#e879f9", "#818cf8", "#22d3ee", "#fb7185"],
    level: "primaire",
    sold: 39,
  },
  {
    slug: "sac-college-30l",
    name: "Sac collège 30L Résistant",
    nameAr: "حقيبة الإعدادية 30 لتراً",
    description:
      "Grande contenance 30 litres, fond en PVC, dos ergonomique et multiples compartiments. Conçu pour durer toute l'année scolaire.",
    descriptionAr:
      "سعة كبيرة 30 لتراً، قاع من PVC، ظهر مريح وجيوب متعددة. مصممة لتدوم طوال السنة الدراسية.",
    category: ProductCategory.COLLEGE,
    brand: "Kadouri Sport",
    price: 379,
    compareAtPrice: 449,
    stock: 22,
    colors: ["#2563eb", "#7c3aed", "#059669", "#dc2626"],
    level: "college",
    sold: 92,
  },
  {
    slug: "sac-lycee-pc-15",
    name: "Sac lycée Compartiment PC 15.6\"",
    nameAr: "حقيبة الثانوي مع جيب حاسوب 15.6",
    description:
      "Sac lycée avec compartiment rembourré pour ordinateur 15.6 pouces, poche anti-vol et clip porte-clés. L'allié du lycéen.",
    descriptionAr:
      "حقيبة ثانوية بجيب مبطن للحاسوب مقاس 15.6 بوصة، جيب مضاد للسرقة وحلقة مفاتيح. حليف الطالب.",
    category: ProductCategory.COLLEGE,
    brand: "Kadouri Sport",
    price: 429,
    stock: 14,
    colors: ["#0f172a", "#334155", "#1e293b", "#e11d48"],
    level: "lycee",
    sold: 58,
  },
  {
    slug: "sacoche-pc-15",
    name: "Sacoche ordinateur 15.6\"",
    nameAr: "حقيبة حاسوب 15.6 بوصة",
    description:
      "Sacoche professionnelle étanche avec compartiment molletonné, poche tablette et bandoulière réglable. Pour les étudiants et salariés.",
    descriptionAr:
      "حقيبة احترافية مقاومة للماء بجيب مبطّن، جيب للحاسوب اللوحي وحزام كتف قابل للتعديل. للطلاب والموظفين.",
    category: ProductCategory.PC,
    brand: "Rif Traveller",
    price: 359,
    compareAtPrice: 419,
    stock: 19,
    colors: ["#1f2937", "#374151", "#0f766e", "#7c3aed"],
    level: "universite",
    sold: 66,
  },
  {
    slug: "sac-pc-urbain-14",
    name: "Sac ordinateur Urbain 14\"",
    nameAr: "حقيبة حاسوب حضرية 14 بوصة",
    description:
      "Sac moderne et compact pour PC 14 pouces, look minimaliste et protection renforcée. Le choix malin des étudiants de Casablanca.",
    descriptionAr:
      "حقيبة عصرية وصغيرة لحاسوب مقاس 14 بوصة، مظهر بسيط وحماية معززة. الاختيار الذكي لطلاب الدار البيضاء.",
    category: ProductCategory.PC,
    brand: "Kenza Bags",
    price: 319,
    stock: 17,
    colors: ["#111827", "#4b5563", "#2563eb", "#0ea5e9"],
    level: "universite",
    sold: 48,
  },
  {
    slug: "trousse-garnie-25",
    name: "Trousse garnie 25 pièces",
    nameAr: "مقلمة كاملة 25 قطعة",
    description:
      "Trousse complète : stylos, crayons, gommes, règle, ciseaux, surligneurs… 25 pièces de qualité. Le kit de rentrée prêt à l'emploi.",
    descriptionAr:
      "مقلمة كاملة: أقلام، أقلام رصاص، مماحاة، مسطرة، مقص، أقلام تظليل… 25 قطعة بجودة عالية. عدة الدخول المدرسي جاهزة.",
    category: ProductCategory.TROUSSE,
    brand: "Soukina",
    price: 129,
    compareAtPrice: 169,
    stock: 60,
    colors: ["#f43f5e", "#3b82f6", "#10b981", "#eab308"],
    level: "primaire",
    featured: true,
    sold: 214,
  },
  {
    slug: "trousse-double-zip",
    name: "Trousse Double Zip",
    nameAr: "مقلمة بسحاب مزدوج",
    description:
      "Trousse à deux compartiments en matière lavable, parfaite pour organiser stylos et petits accessoires.",
    descriptionAr:
      "مقلمة بجيبين من خامة قابلة للغسل، مثالية لتنظيم الأقلام والأغراض الصغيرة.",
    category: ProductCategory.TROUSSE,
    brand: "Atlas Kids",
    price: 79,
    stock: 80,
    colors: ["#8b5cf6", "#22d3ee", "#fb7185", "#34d399"],
    level: "college",
    sold: 160,
  },
  {
    slug: "trousse-licorne",
    name: "Trousse Licorne",
    nameAr: "مقلمة يونيكورن",
    description:
      "Trousse pailletée au design licorne avec zip doré. Le petit plus qui fait plaisir aux enfants.",
    descriptionAr:
      "مقلمة لامعة بتصميم يونيكورن وسحاب ذهبي. لمسة تبهج الأطفال.",
    category: ProductCategory.TROUSSE,
    brand: "Soukina",
    price: 89,
    stock: 55,
    colors: ["#f9a8d4", "#c4b5fd", "#f0abfc", "#fbcfe8"],
    level: "primaire",
    sold: 133,
  },
  {
    slug: "porte-cartable-reflechissant",
    name: "Porte-cartable Réfléchissant",
    nameAr: "حافظة حقيبة عاكسة",
    description:
      "Porte-cartable avec bandes réfléchissantes pour la sécurité des enfants à vélo ou à pied. Matériau résistant.",
    descriptionAr:
      "حافظة حقيبة بشرائط عاكسة لسلامة الأطفال أثناء ركوب الدراجة أو المشي. خامة مقاومة.",
    category: ProductCategory.ACCESSOIRE,
    brand: "Atlas Kids",
    price: 49,
    stock: 100,
    colors: ["#f97316", "#eab308", "#22c55e", "#ef4444"],
    level: "primaire",
    sold: 97,
  },
  {
    slug: "gourde-isotherme-500ml",
    name: "Gourde isotherme 500ml",
    nameAr: "قارورة حرارية 500 مل",
    description:
      "Gourde isotherme en acier inoxydable 500ml, garde au froid 12h et au chaud 6h. Bouchon étanche anti-fuite.",
    descriptionAr:
      "قارورة حرارية من الفولاذ المقاوم للصدأ 500 مل، تحافظ على البرودة 12 ساعة والسخونة 6 ساعات. غطاء مانع للتسرب.",
    category: ProductCategory.ACCESSOIRE,
    brand: "Rif Traveller",
    price: 99,
    compareAtPrice: 129,
    stock: 70,
    colors: ["#0ea5e9", "#22c55e", "#f43f5e", "#eab308"],
    level: "college",
    sold: 142,
  },
  {
    slug: "boite-gouter-bpa",
    name: "Boîte à goûter BPA Free",
    nameAr: "علبة الوجبات الخفيفة",
    description:
      "Boîte à goûter hermétique BPA free avec compartiments, passe au lave-vaisselle et micro-ondes. Lavable à l'infini.",
    descriptionAr:
      "علبة محكمة الإغلاق خالية من BPA مع أقسام، آمنة لغسالة الصحون والميكروويف.",
    category: ProductCategory.ACCESSOIRE,
    brand: "Soukina",
    price: 69,
    stock: 85,
    colors: ["#14b8a6", "#f472b6", "#a3e635", "#fbbf24"],
    level: "primaire",
    sold: 121,
  },
  {
    slug: "etiquettes-scolaires",
    name: "Étiquettes scolaires personnalisées",
    nameAr: "ملصقات مدرسية مخصصة",
    description:
      "Pack de 30 étiquettes autocollantes personnalisées pour les affaires scolaires. Options motifs et prénoms à la commande.",
    descriptionAr:
      "حزمة من 30 ملصقاً ذاتياً للمقتنيات المدرسية. خيارات للتصاميم والأسماء عند الطلب.",
    category: ProductCategory.ACCESSOIRE,
    brand: "Zitouna Kids",
    price: 39,
    stock: 200,
    colors: ["#818cf8", "#f472b6", "#34d399", "#fbbf24"],
    level: "primaire",
    sold: 88,
  },
  {
    slug: "kit-protège-cahiers",
    name: "Kit Protège-cahiers + Plans",
    nameAr: "طقم أغطية الدفاتر",
    description:
      "Kit rentrée : 6 protège-cahiers, 4 plans de cartable et 1 emploi du temps. Pour une rentrée organisée à petit prix.",
    descriptionAr:
      "طقم الدخول المدرسي: 6 أغطية دفاتر، 4 خطط للحقيبة وجدول حصص. لدخول منظم بسعر مناسب.",
    category: ProductCategory.ACCESSOIRE,
    brand: "Atlas Kids",
    price: 59,
    compareAtPrice: 79,
    stock: 90,
    colors: ["#0d9488", "#0284c7", "#9333ea", "#ea580c"],
    level: "college",
    sold: 76,
  },
];

function slugify(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  console.log("🧹 Nettoyage de la base…");
  await prisma.deliveryAssignment.deleteMany();
  await prisma.statusEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subscriber.deleteMany();

  console.log("👤 Création des utilisateurs…");
  const buyer = await prisma.user.create({
    data: {
      name: "Aya Benjelloun",
      email: "aya@demo.ma",
      phone: "0661122334",
      passwordHash: hashPassword("demo1234"),
      role: Role.BUYER,
      city: "Casablanca",
      address: "Résidence Al Firdaous, Maârif, Casablanca",
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: "Rachid El Amrani",
      email: "rachid@demo.ma",
      phone: "0667766554",
      whatsapp: "0667766554",
      passwordHash: hashPassword("demo1234"),
      role: Role.SELLER,
      city: "Casablanca",
      address: "Derb Omar, Commerce 2, Casablanca",
    },
  });

  const delivery = await prisma.user.create({
    data: {
      name: "Youssef Tazi",
      email: "youssef@demo.ma",
      phone: "0655443321",
      passwordHash: hashPassword("demo1234"),
      role: Role.DELIVERY,
      city: "Casablanca",
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin Cartabl",
      email: "admin@demo.ma",
      phone: "0600000000",
      passwordHash: hashPassword("admin1234"),
      role: Role.ADMIN,
      city: "Casablanca",
    },
  });

  console.log("🎒 Création des produits…");
  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        nameAr: p.nameAr,
        description: p.description,
        descriptionAr: p.descriptionAr,
        category: p.category,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        colorsJson: JSON.stringify(p.colors),
        level: p.level,
        featured: p.featured ?? false,
        sold: p.sold ?? 0,
        rating: 4.4 + (Math.random() * 0.5),
        ratingCount: 8 + Math.floor(Math.random() * 40),
        sellerId: seller.id,
      },
    });
  }

  console.log("⭐ Création des avis…");
  const sampleComments = [
    "Excellente qualité, ma fille l'adore !",
    "Très belle finition, livraison rapide à Rabat.",
    "Rapport qualité/prix imbattable. Je recommande.",
    "Solide et spacieux, parfait pour la rentrée.",
    "Mon fils ne le quitte plus. Super produit.",
    "Reçu en 2 jours à Marrakech. Merci !",
    "Les couleurs sont encore plus belles en vrai.",
    "Bon produit, conforme à la description.",
    "Parfait pour le collège, très résistant.",
    "Joli design et matière agréable au toucher.",
  ];

  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: buyer.id,
          rating: 4 + Math.round(Math.random()),
          comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
        },
      });
    }
  }

  console.log("📦 Création des commandes de démonstration…");
  const mapProducts = Object.fromEntries(allProducts.map((p) => [p.slug, p]));

  const item1 = mapProducts["cartable-panda-roux"];
  const item2 = mapProducts["sac-dos-ergo-22l"];
  const item3 = mapProducts["trousse-garnie-25"];
  const item4 = mapProducts["gourde-isotherme-500ml"];
  const item5 = mapProducts["cartable-roulettes-maxi"];
  const item6 = mapProducts["sac-college-30l"];

  const mkEvent = (orderId: string, status: OrderStatus, actor: string, actorName: string, note?: string, createdAt?: Date) =>
    prisma.statusEvent.create({
      data: { orderId, status, actor, actorName, note, createdAt: createdAt ?? new Date() },
    });

  // Commande 1 : livrée (historique complet)
  const o1 = await prisma.order.create({
    data: {
      number: "CMD-2026-1041",
      trackingCode: "CM-AZ7K2Q",
      userId: buyer.id,
      customerName: "Aya Benjelloun",
      customerPhone: "0661122334",
      customerEmail: "aya@demo.ma",
      city: "Casablanca",
      address: "Résidence Al Firdaous, Maârif, Casablanca",
      paymentMethod: "COD",
      subtotal: 249 + 129 + 99,
      shippingFee: 0,
      discount: 25,
      total: 249 + 129 + 99 + 0 - 25,
      status: OrderStatus.DELIVERED,
      deliveredAt: new Date("2026-07-28T17:30:00"),
      items: {
        create: [
          { productId: item1.id, productName: item1.name, productSlug: item1.slug, quantity: 1, unitPrice: 249, total: 249 },
          { productId: item3.id, productName: item3.name, productSlug: item3.slug, quantity: 1, unitPrice: 129, total: 129 },
          { productId: item4.id, productName: item4.name, productSlug: item4.slug, quantity: 1, unitPrice: 99, total: 99 },
        ],
      },
    },
  });
  await mkEvent(o1.id, OrderStatus.PENDING, "SYSTEM", "Système", "Commande reçue via le site", new Date("2026-07-25T10:02:00"));
  await mkEvent(o1.id, OrderStatus.CONFIRMED, "SELLER", "Rachid El Amrani", "Commande confirmée, paiement à la livraison", new Date("2026-07-25T11:15:00"));
  await mkEvent(o1.id, OrderStatus.PREPARING, "SELLER", "Rachid El Amrani", "Articles en cours de préparation", new Date("2026-07-26T09:00:00"));
  await mkEvent(o1.id, OrderStatus.HANDED_TO_DELIVERY, "SELLER", "Rachid El Amrani", "Colis remis à Youssef Tazi", new Date("2026-07-27T08:45:00"));
  await mkEvent(o1.id, OrderStatus.IN_TRANSIT, "DELIVERY", "Youssef Tazi", "En cours d'acheminement vers Casablanca", new Date("2026-07-27T14:20:00"));
  await mkEvent(o1.id, OrderStatus.OUT_FOR_DELIVERY, "DELIVERY", "Youssef Tazi", "Le livreur est en route vers votre adresse", new Date("2026-07-28T09:40:00"));
  await mkEvent(o1.id, OrderStatus.DELIVERED, "DELIVERY", "Youssef Tazi", "Colis livré et réglé en espèces", new Date("2026-07-28T17:30:00"));

  // Commande 2 : en cours de livraison (livreur)
  const o2 = await prisma.order.create({
    data: {
      number: "CMD-2026-1078",
      trackingCode: "CM-MX9D4T",
      userId: buyer.id,
      customerName: "Aya Benjelloun",
      customerPhone: "0661122334",
      customerEmail: "aya@demo.ma",
      city: "Rabat",
      address: "Avenue Mohammed V, Agdal, Rabat",
      paymentMethod: "COD",
      subtotal: 349 + 269,
      shippingFee: 30,
      discount: 0,
      total: 349 + 269 + 30,
      status: OrderStatus.IN_TRANSIT,
      items: {
        create: [
          { productId: item2.id, productName: item2.name, productSlug: item2.slug, quantity: 1, unitPrice: 349, total: 349 },
          { productId: item5.id, productName: item5.name, productSlug: item5.slug, quantity: 1, unitPrice: 269, total: 269 },
        ],
      },
      delivery: { create: { deliveryId: delivery.id } },
    },
  });
  await mkEvent(o2.id, OrderStatus.PENDING, "SYSTEM", "Système", "Commande reçue via le site", new Date("2026-08-03T09:20:00"));
  await mkEvent(o2.id, OrderStatus.CONFIRMED, "SELLER", "Rachid El Amrani", "Commande confirmée", new Date("2026-08-03T10:05:00"));
  await mkEvent(o2.id, OrderStatus.PREPARING, "SELLER", "Rachid El Amrani", "Emballage soigné en cours", new Date("2026-08-04T09:30:00"));
  await mkEvent(o2.id, OrderStatus.HANDED_TO_DELIVERY, "SELLER", "Rachid El Amrani", "Colis remis au livreur", new Date("2026-08-05T08:15:00"));
  await mkEvent(o2.id, OrderStatus.IN_TRANSIT, "DELIVERY", "Youssef Tazi", "Acheminement vers Rabat en cours", new Date("2026-08-05T16:00:00"));

  // Commande 3 : confirmée (en attente de préparation)
  const o3 = await prisma.order.create({
    data: {
      number: "CMD-2026-1093",
      trackingCode: "CM-BW3H8R",
      userId: buyer.id,
      customerName: "Aya Benjelloun",
      customerPhone: "0661122334",
      customerEmail: "aya@demo.ma",
      city: "Marrakech",
      address: "Guéliz, Rue Ibn Aïcha, Marrakech",
      paymentMethod: "COD",
      subtotal: 379,
      shippingFee: 40,
      discount: 0,
      total: 379 + 40,
      status: OrderStatus.CONFIRMED,
      items: {
        create: [
          { productId: item6.id, productName: item6.name, productSlug: item6.slug, quantity: 1, unitPrice: 379, total: 379 },
        ],
      },
    },
  });
  await mkEvent(o3.id, OrderStatus.PENDING, "SYSTEM", "Système", "Commande reçue via le site", new Date("2026-08-05T18:45:00"));
  await mkEvent(o3.id, OrderStatus.CONFIRMED, "SELLER", "Rachid El Amrani", "Commande confirmée, paiement à la livraison", new Date("2026-08-06T09:10:00"));

  console.log("✅ Seed terminé !");
  console.log("   Acheteur : aya@demo.ma / demo1234");
  console.log("   Marchand : rachid@demo.ma / demo1234");
  console.log("   Livreur  : youssef@demo.ma / demo1234");
  console.log("   Admin    : admin@demo.ma / admin1234");
  console.log("   Code de suivi d'exemple : CM-AZ7K2Q");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
