import type { ProductCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return [99, 102, 241];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function lighten(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) => clamp(c + (255 - c) * amt);
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function darken(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) => clamp(c * (1 - amt));
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CATEGORY_BASE: Record<ProductCategory, string> = {
  CLASSIQUE: "#e11d48",
  DOS: "#2563eb",
  ROULETTES: "#9333ea",
  COLLEGE: "#059669",
  PC: "#334155",
  TROUSSE: "#f59e0b",
  ACCESSOIRE: "#ec4899",
};

type Variant = "front" | "side" | "detail";

function ClassicSatchel({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <path d="M110 150 L290 150 L290 320 Q290 350 260 350 L140 350 Q110 350 110 320 Z" fill={c} />
      <path d="M110 150 L290 150 L290 320 Q290 350 260 350 L140 350 Q110 350 110 320 Z" fill={darken(c, 0.12)} opacity="0.35" />
      <rect x="110" y="170" width="180" height="150" rx="18" fill={darken(c, 0.18)} />
      <path d="M200 150 L200 110 Q200 95 215 95 L285 95 L285 150 Z" fill={darken(c, 0.15)} />
      <circle cx="225" cy="105" r="8" fill={accent} />
      <path d="M140 190 h90" stroke={accent} strokeWidth="10" strokeLinecap="round" />
      <rect x="110" y="262" width="180" height="58" rx="12" fill={withAlpha(accent, 0.85)} />
      <circle cx="200" cy="291" r="16" fill={withAlpha("#ffffff", 0.25)} />
      <path d="M95 150 h210" stroke={darken(c, 0.35)} strokeWidth="5" strokeDasharray="1 8" strokeLinecap="round" />
      <path d="M110 150 L140 120 L190 120 L160 150 Z" fill={lighten(c, 0.35)} />
      <path d="M200 150 L230 120 L280 120 L250 150 Z" fill={lighten(c, 0.45)} />
    </g>
  );
}

function Backpack({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <path d="M150 120 h100 l18 40 v130 q0 28 -28 28 h-80 q-28 0 -28 -28 v-130 Z" fill={c} />
      <rect x="128" y="300" width="144" height="22" rx="11" fill={darken(c, 0.12)} />
      <path d="M170 120 v-25 q0 -12 12 -12 h36 q12 0 12 12 v25" fill="none" stroke={darken(c, 0.2)} strokeWidth="16" strokeLinecap="round" />
      <path d="M120 120 h160" stroke={darken(c, 0.35)} strokeWidth="6" strokeLinecap="round" />
      <rect x="142" y="168" width="116" height="84" rx="16" fill={withAlpha(accent, 0.9)} />
      <rect x="158" y="184" width="84" height="52" rx="10" fill={withAlpha("#ffffff", 0.22)} />
      <path d="M142 286 h116" stroke={accent} strokeWidth="8" strokeLinecap="round" />
      <rect x="150" y="268" width="30" height="14" rx="4" fill={lighten(c, 0.3)} />
      <circle cx="214" cy="230" r="7" fill={accent} />
      <path d="M128 300 q-10 0 -10 -10 v-6" stroke={darken(c, 0.2)} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M272 300 q10 0 10 -10 v-6" stroke={darken(c, 0.2)} strokeWidth="9" fill="none" strokeLinecap="round" />
    </g>
  );
}

function RollingBag({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <path d="M120 120 h160 l22 60 v120 q0 24 -24 24 h-156 q-24 0 -24 -24 v-120 Z" fill={c} />
      <path d="M120 120 h160 l22 60 h-204 Z" fill={darken(c, 0.15)} />
      <rect x="104" y="80" width="196" height="24" rx="12" fill={darken(c, 0.25)} />
      <path d="M200 80 v-14 q0 -10 10 -10 h28 q10 0 10 10 v14" fill="none" stroke={darken(c, 0.3)} strokeWidth="10" strokeLinecap="round" />
      <rect x="136" y="196" width="128" height="66" rx="14" fill={withAlpha(accent, 0.9)} />
      <path d="M120 320 q-4 0 -4 -4 v-12 q0 -8 8 -8 h132 q8 0 8 8 v12 q0 4 -4 4 Z" fill="#1f2937" />
      <circle cx="160" cy="312" r="9" fill="#9ca3af" />
      <circle cx="240" cy="312" r="9" fill="#9ca3af" />
      <path d="M148 330 l20 34 h36 l20 -34 Z" fill={darken(c, 0.35)} />
      <rect x="136" y="252" width="128" height="10" rx="5" fill={lighten(c, 0.3)} />
    </g>
  );
}

function CollegeBag({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <path d="M150 118 h100 l16 42 v132 q0 26 -26 26 h-80 q-26 0 -26 -26 v-132 Z" fill={c} />
      <path d="M172 118 v-24 q0 -12 12 -12 h32 q12 0 12 12 v24" fill="none" stroke={darken(c, 0.22)} strokeWidth="15" strokeLinecap="round" />
      <rect x="116" y="318" width="168" height="18" rx="9" fill={darken(c, 0.1)} />
      <rect x="140" y="170" width="120" height="130" rx="16" fill={withAlpha("#ffffff", 0.9)} />
      <rect x="154" y="184" width="92" height="100" rx="10" fill={lighten(c, 0.55)} />
      <path d="M154 230 h92" stroke={accent} strokeWidth="7" />
      <path d="M200 270 h0" />
      <path d="M168 296 h64" stroke={darken(c, 0.3)} strokeWidth="6" strokeLinecap="round" />
      <circle cx="176" cy="204" r="9" fill={accent} />
      <path d="M200 200 l14 0 l-7 12 Z" fill={accent} />
      <path d="M120 318 q-8 0 -8 -8 v-8" stroke={darken(c, 0.15)} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M280 318 q8 0 8 -8 v-8" stroke={darken(c, 0.15)} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M146 152 h108" stroke={darken(c, 0.3)} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function LaptopBag({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <rect x="96" y="150" width="208" height="170" rx="22" fill={c} />
      <path d="M96 210 q104 -30 208 0" fill="none" stroke={withAlpha("#ffffff", 0.18)} strokeWidth="14" />
      <rect x="122" y="214" width="156" height="60" rx="12" fill={withAlpha("#ffffff", 0.92)} />
      <rect x="134" y="226" width="96" height="6" rx="3" fill={darken(c, 0.25)} />
      <rect x="134" y="242" width="70" height="6" rx="3" fill={darken(c, 0.15)} />
      <path d="M132 150 v-22 q0 -10 10 -10 h116 q10 0 10 10 v22" fill={darken(c, 0.12)} />
      <rect x="96" y="120" width="208" height="30" rx="15" fill={darken(c, 0.2)} />
      <rect x="118" y="282" width="64" height="20" rx="8" fill={withAlpha(accent, 0.9)} />
      <path d="M278 200 q26 0 26 26 v24 q0 26 -26 26" fill="none" stroke={darken(c, 0.25)} strokeWidth="12" strokeLinecap="round" />
      <path d="M96 300 q-14 0 -14 -14" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" />
    </g>
  );
}

function PencilCase({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <rect x="90" y="200" width="220" height="130" rx="30" fill={c} />
      <path d="M90 240 h220" stroke={darken(c, 0.2)} strokeWidth="8" />
      <path d="M110 212 h180" stroke={accent} strokeWidth="8" strokeLinecap="round" />
      <rect x="90" y="240" width="220" height="90" rx="26" fill={darken(c, 0.14)} />
      <path d="M140 150 l12 40 h28 l12 -40 Z" fill={darken("#f59e0b", 0.1)} />
      <path d="M190 150 l12 40 h28 l12 -40 Z" fill={accent} />
      <path d="M240 150 l12 40 h28 l12 -40 Z" fill={darken("#e11d48", 0.05)} />
      <path d="M150 150 l-4 -18 M232 150 l-4 -18 M282 150 l-4 -18" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <circle cx="200" cy="285" r="12" fill={lighten(accent, 0.4)} />
      <path d="M196 285 l8 8 l12 -14" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      <rect x="90" y="196" width="220" height="14" rx="7" fill={lighten(c, 0.3)} />
    </g>
  );
}

function AccessoryKit({ c, accent }: { c: string; accent: string }) {
  return (
    <g>
      <path d="M120 160 h160 v150 q0 20 -20 20 h-120 q-20 0 -20 -20 Z" fill={c} />
      <path d="M120 160 h160 l-14 -34 q-4 -10 -14 -10 h-104 q-10 0 -14 10 Z" fill={darken(c, 0.16)} />
      <path d="M140 170 h120" stroke={accent} strokeWidth="9" strokeLinecap="round" />
      <circle cx="150" cy="230" r="22" fill={lighten(c, 0.4)} />
      <path d="M145 230 l5 6 l10 -13" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <rect x="186" y="212" width="74" height="44" rx="8" fill={withAlpha("#ffffff", 0.92)} />
      <path d="M196 224 h54 M196 238 h36" stroke={darken(c, 0.25)} strokeWidth="5" strokeLinecap="round" />
      <circle cx="252" cy="292" r="18" fill={accent} />
      <path d="M246 292 l6 6 l10 -12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M120 330 h160" stroke={darken(c, 0.3)} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function drawBody(category: ProductCategory, c: string, accent: string) {
  switch (category) {
    case "CLASSIQUE":
      return <ClassicSatchel c={c} accent={accent} />;
    case "DOS":
      return <Backpack c={c} accent={accent} />;
    case "ROULETTES":
      return <RollingBag c={c} accent={accent} />;
    case "COLLEGE":
      return <CollegeBag c={c} accent={accent} />;
    case "PC":
      return <LaptopBag c={c} accent={accent} />;
    case "TROUSSE":
      return <PencilCase c={c} accent={accent} />;
    default:
      return <AccessoryKit c={c} accent={accent} />;
  }
}

export type ProductArtProps = {
  category: ProductCategory;
  colors?: string[];
  variant?: Variant;
  className?: string;
};

export function ProductArt({ category, colors, variant = "front", className }: ProductArtProps) {
  const base = colors?.[0] || CATEGORY_BASE[category];
  const accent = colors?.[1] || lighten(base, 0.35);
  const bgTop = lighten(base, 0.78);
  const bgBottom = lighten(base, 0.55);

  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("block h-full w-full select-none", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bg-${category}-${base.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="100%" stopColor={bgBottom} />
        </linearGradient>
        <radialGradient id={`glow-${category}-${base.replace("#", "")}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={withAlpha("#ffffff", 0.55)} />
          <stop offset="100%" stopColor={withAlpha("#ffffff", 0)} />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#bg-${category}-${base.replace("#", "")})`} />
      <rect width="400" height="400" fill={`url(#glow-${category}-${base.replace("#", "")})`} />
      {variant === "side" && (
        <rect width="400" height="400" fill={withAlpha("#0f172a", 0.04)} />
      )}
      {variant === "detail" && (
        <g>
          <circle cx="320" cy="80" r="26" fill={withAlpha("#ffffff", 0.5)} />
          <circle cx="80" cy="330" r="20" fill={withAlpha("#ffffff", 0.35)} />
          <circle cx="90" cy="70" r="8" fill={withAlpha("#ffffff", 0.4)} />
          <circle cx="340" cy="300" r="10" fill={withAlpha("#ffffff", 0.4)} />
        </g>
      )}
      {variant !== "detail" && (
        <g>
          <circle cx="92" cy="72" r="7" fill={withAlpha("#ffffff", 0.45)} />
          <circle cx="318" cy="92" r="5" fill={withAlpha("#ffffff", 0.4)} />
          <circle cx="84" cy="308" r="5" fill={withAlpha("#ffffff", 0.4)} />
        </g>
      )}
      <ellipse cx="200" cy="348" rx="92" ry="16" fill={withAlpha(base, 0.22)} />
      <g transform={variant === "side" ? "translate(18 0)" : variant === "detail" ? "scale(1.28) translate(-42 -40)" : undefined}>
        {drawBody(category, base, accent)}
      </g>
    </svg>
  );
}
