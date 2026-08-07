import type { ProductCategory } from "@prisma/client";
import type { MessageKey } from "./i18n";

export const CATEGORY_META: Record<
  ProductCategory,
  { key: MessageKey; emoji: string; gradient: string; ring: string }
> = {
  CLASSIQUE: {
    key: "cat_classique",
    emoji: "🎒",
    gradient: "from-rose-500 to-orange-400",
    ring: "ring-rose-200",
  },
  DOS: {
    key: "cat_dos",
    emoji: "🎽",
    gradient: "from-blue-500 to-cyan-400",
    ring: "ring-blue-200",
  },
  ROULETTES: {
    key: "cat_roulettes",
    emoji: "🧳",
    gradient: "from-fuchsia-500 to-purple-400",
    ring: "ring-fuchsia-200",
  },
  COLLEGE: {
    key: "cat_college",
    emoji: "📚",
    gradient: "from-emerald-500 to-teal-400",
    ring: "ring-emerald-200",
  },
  PC: {
    key: "cat_pc",
    emoji: "💻",
    gradient: "from-slate-600 to-slate-400",
    ring: "ring-slate-200",
  },
  TROUSSE: {
    key: "cat_trousse",
    emoji: "✏️",
    gradient: "from-amber-500 to-yellow-400",
    ring: "ring-amber-200",
  },
  ACCESSOIRE: {
    key: "cat_accessoire",
    emoji: "🎀",
    gradient: "from-pink-500 to-rose-400",
    ring: "ring-pink-200",
  },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_META) as ProductCategory[];
