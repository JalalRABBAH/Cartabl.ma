import type { OrderStatus } from "@prisma/client";

export const ORDER_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "HANDED_TO_DELIVERY",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const ACTOR = {
  SYSTEM: "SYSTEM",
  SELLER: "SELLER",
  BUYER: "BUYER",
  DELIVERY: "DELIVERY",
} as const;

export function isTerminal(status: OrderStatus): boolean {
  return status === "DELIVERED" || status === "CANCELED" || status === "RETURNED";
}

export function stepOf(status: OrderStatus): number {
  const idx = ORDER_FLOW.indexOf(status);
  return idx === -1 ? -1 : idx;
}

export type ActorType = "SELLER" | "DELIVERY" | "BUYER";

export function allowedTransitions(status: OrderStatus, actor: ActorType): OrderStatus[] {
  if (isTerminal(status)) return [];
  if (actor === "BUYER") {
    if (status === "PENDING") return ["CANCELED"];
    return [];
  }
  if (actor === "SELLER") {
    switch (status) {
      case "PENDING":
        return ["CONFIRMED", "CANCELED"];
      case "CONFIRMED":
        return ["PREPARING", "CANCELED"];
      case "PREPARING":
        return ["HANDED_TO_DELIVERY", "CANCELED"];
      default:
        return [];
    }
  }
  if (actor === "DELIVERY") {
    switch (status) {
      case "HANDED_TO_DELIVERY":
        return ["IN_TRANSIT", "DELIVERED"];
      case "IN_TRANSIT":
        return ["OUT_FOR_DELIVERY", "DELIVERED"];
      case "OUT_FOR_DELIVERY":
        return ["DELIVERED"];
      default:
        return [];
    }
  }
  return [];
}

export const STATUS_STYLE: Record<OrderStatus, { badge: string; dot: string }> = {
  PENDING: { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  CONFIRMED: { badge: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  PREPARING: { badge: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
  HANDED_TO_DELIVERY: { badge: "bg-indigo-50 text-indigo-700 ring-indigo-200", dot: "bg-indigo-500" },
  IN_TRANSIT: { badge: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
  OUT_FOR_DELIVERY: { badge: "bg-teal-50 text-teal-700 ring-teal-200", dot: "bg-teal-500" },
  DELIVERED: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  CANCELED: { badge: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
  RETURNED: { badge: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
};
