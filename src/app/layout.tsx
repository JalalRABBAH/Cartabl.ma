import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, dirFor, type Locale } from "@/lib/i18n";
import { LocaleProvider } from "./providers";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cartabl.ma — Cartables & sacs scolaires au Maroc",
    template: "%s | Cartabl.ma",
  },
  description:
    "Boutique en ligne de cartables, sacs à dos et accessoires scolaires au Maroc. Livraison rapide à Casablanca, Rabat, Marrakech, Fès, Tanger et Agadir. Paiement à la livraison.",
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

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body>
        <LocaleProvider locale={locale}>
          <CartProvider>{children}</CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
