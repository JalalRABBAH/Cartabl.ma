import type { MetadataRoute } from "next";
import { BLOG_POSTS, BLOG_RUBRIQUES, SITE_URL } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/produits`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/livraison`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/apropos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/suivi`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  const categories = [
    "CLASSIQUE",
    "DOS",
    "ROULETTES",
    "COLLEGE",
    "PC",
    "TROUSSE",
    "ACCESSOIRE",
  ].map((cat) => ({
    url: `${SITE_URL}/produits?cat=${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated ? new Date(post.updated) : new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const rubriques: MetadataRoute.Sitemap = BLOG_RUBRIQUES.map((r) => ({
    url: `${SITE_URL}/blog/rubrique/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  let products: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, createdAt: true },
    });
    products = rows.map((p) => ({
      url: `${SITE_URL}/produits/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // base de données indisponible au build : on expose le reste du sitemap
  }

  return [...statics, ...categories, ...posts, ...rubriques, ...products];
}