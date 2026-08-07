"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale, type MessageKey, LOCALE_COOKIE } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  T: (key: MessageKey, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Locale>(locale);

  const T = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => t(current, key, vars),
    [current],
  );

  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrent(next);
    router.refresh();
  };

  return (
    <LocaleContext.Provider value={{ locale: current, T, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
