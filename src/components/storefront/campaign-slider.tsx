"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Store, Truck, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/app/providers";
import { t, type Locale } from "@/lib/i18n";

type Slide = {
  icon: typeof Store;
  gradient: string;
  titleKey: string;
  descKey: string;
  ctaKey: string;
  href: string;
  iconBg: string;
};

const SLIDES: Slide[] = [
  {
    icon: Store,
    gradient: "from-brand-700 via-brand-800 to-indigo-950",
    titleKey: "campaign_merchant_title",
    descKey: "campaign_merchant_desc",
    ctaKey: "campaign_merchant_cta",
    href: "/compte/inscription?role=SELLER",
    iconBg: "bg-white/15",
  },
  {
    icon: Truck,
    gradient: "from-emerald-600 via-emerald-700 to-teal-800",
    titleKey: "campaign_delivery_title",
    descKey: "campaign_delivery_desc",
    ctaKey: "campaign_delivery_cta",
    href: "/compte/inscription?role=DELIVERY",
    iconBg: "bg-white/15",
  },
  {
    icon: ShoppingBag,
    gradient: "from-sand-600 via-sand-700 to-brand-800",
    titleKey: "campaign_buyer_title",
    descKey: "campaign_buyer_desc",
    ctaKey: "campaign_buyer_cta",
    href: "/compte/inscription",
    iconBg: "bg-white/15",
  },
];

export function CampaignSlider() {
  const { locale } = useLocale();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = SLIDES[current];
  const Icon = slide.icon;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${slide.gradient} transition-colors duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="zellige absolute inset-0" />
      <div className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div className="container-site relative flex items-center gap-6 py-5 sm:py-6">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${slide.iconBg} backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black text-white sm:text-lg">
            {t(locale, slide.titleKey as never)}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-white/70 sm:text-sm">
            {t(locale, slide.descKey as never)}
          </p>
        </div>
        <Link
          href={slide.href}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-gray-50 hover:shadow-xl sm:inline-flex"
        >
          {t(locale, slide.ctaKey as never)}
        </Link>
      </div>

      <button
        onClick={prev}
        className="absolute start-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
