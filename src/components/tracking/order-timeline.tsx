import { cn } from "@/lib/utils";
import { ORDER_FLOW, stepOf, isTerminal, STATUS_STYLE } from "@/lib/orders";
import { t, type Locale } from "@/lib/i18n";
import type { OrderStatus } from "@prisma/client";
import { Check, X, Ban, Clock } from "lucide-react";

export type TimelineEvent = {
  id?: string;
  status: OrderStatus;
  actor: string;
  actorName: string | null;
  note: string | null;
  createdAt: string | Date;
};

export function StatusBadge({ status, locale, className }: { status: OrderStatus; locale: Locale; className?: string }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1",
        style.badge,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {t(locale, `status_${status.toLowerCase()}` as never)}
    </span>
  );
}

export function OrderTimeline({
  status,
  events,
  locale,
}: {
  status: OrderStatus;
  events: TimelineEvent[];
  locale: Locale;
}) {
  const currentStep = stepOf(status);
  const terminal = isTerminal(status);
  const sorted = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const actorLabel = (actor: string, name: string | null) => {
    if (actor === "SELLER") return `${t(locale, "merchant_title")}${name ? ` · ${name}` : ""}`;
    if (actor === "DELIVERY") return `${t(locale, "delivery_title")}${name ? ` · ${name}` : ""}`;
    return name ?? "Mbag.ma";
  };

  return (
    <div className="space-y-6">
      {terminal ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-4",
            status === "DELIVERED" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
          )}
        >
          {status === "DELIVERED" ? (
            <Check className="h-6 w-6 shrink-0" />
          ) : (
            <Ban className="h-6 w-6 shrink-0" />
          )}
          <p className="font-bold">{t(locale, `status_${status.toLowerCase()}` as never)}</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-1">
          <ol className="flex min-w-[640px] items-center">
            {ORDER_FLOW.map((s, i) => {
              const done = i < currentStep;
              const current = i === currentStep;
              return (
                <li key={s} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                        done && "border-emerald-500 bg-emerald-500 text-white",
                        current && "border-brand-600 bg-white text-brand-600 ring-4 ring-brand-100",
                        !done && !current && "border-gray-200 bg-white text-gray-300",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : current ? <Clock className="h-4 w-4" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "whitespace-nowrap text-[10px] font-semibold sm:text-[11px]",
                        current ? "text-brand-700" : done ? "text-gray-700" : "text-gray-300",
                      )}
                    >
                      {t(locale, `status_${s.toLowerCase()}` as never)}
                    </span>
                  </div>
                  {i < ORDER_FLOW.length - 1 && (
                    <div className={cn("mx-1 h-0.5 flex-1 rounded-full sm:mx-2", done ? "bg-emerald-400" : "bg-gray-200")} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">{t(locale, "track_timeline")}</h3>
        <ol className="relative space-y-0 border-s-2 border-gray-100 ps-5">
          {[...sorted].reverse().map((ev) => (
            <li key={ev.id ?? `${ev.status}-${ev.createdAt.toString()}`} className="relative pb-5 last:pb-0">
              <span
                className={cn(
                  "absolute -start-[26px] top-1 h-3 w-3 rounded-full border-2 border-white ring-2",
                  STATUS_STYLE[ev.status].dot,
                )}
              />
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ev.status} locale={locale} />
                <span className="text-xs font-medium text-gray-400">
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(ev.createdAt))}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-700">{actorLabel(ev.actor, ev.actorName)}</p>
              {ev.note && <p className="mt-0.5 text-sm text-gray-500">{ev.note}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
