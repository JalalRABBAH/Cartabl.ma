import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, dirFor, type Locale } from "@/lib/i18n";
import { LocaleProvider } from "./providers";
import { CartProvider } from "@/lib/cart-context";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mbag.ma (Maroc Bag) — Sacs & cartables au Maroc",
    template: "%s | Mbag.ma",
  },
  description:
    "Mbag.ma, la boutique marocaine des sacs : cartables, sacs à dos, sacs ordinateur et accessoires scolaires. Livraison rapide à Casablanca, Rabat, Marrakech, Fès, Tanger et Agadir. Paiement à la livraison.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    siteName: "Mbag.ma",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1d38d5",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE)?.value;
  const locale: Locale = raw === "ar" ? "ar" : DEFAULT_LOCALE;

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mbag.ma (Maroc Bag)",
    alternateName: "Maroc Bag · Sacs & cartables",
    url: "https://mbag.ma",
    inLanguage: locale === "ar" ? "ar" : "fr",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://mbag.ma/produits?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <LocaleProvider locale={locale}>
          <CartProvider>{children}</CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
