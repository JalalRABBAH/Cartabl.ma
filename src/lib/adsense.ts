export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export const ADSENSE_SLOTS = {
  blogIndex: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INDEX || "",
  blogArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_ARTICLE || "",
  blogSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_SIDEBAR || "",
  blogRubrique: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_RUBRIQUE || "",
} as const;

export function hasAdSense(): boolean {
  return Boolean(ADSENSE_CLIENT);
}