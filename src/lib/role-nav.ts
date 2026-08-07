import type { Role } from "@prisma/client";
import type { MessageKey } from "@/lib/i18n";

export function homePathFor(role: Role | null | undefined): string {
  switch (role) {
    case "SELLER":
      return "/marchand";
    case "DELIVERY":
      return "/livreur";
    case "ADMIN":
      return "/admin";
    default:
      return "/compte";
  }
}

export function homeLabelKeyFor(role: Role | null | undefined): MessageKey {
  switch (role) {
    case "SELLER":
      return "nav_merchant";
    case "DELIVERY":
      return "nav_delivery";
    case "ADMIN":
      return "nav_admin";
    default:
      return "nav_account";
  }
}

export function isBuyerFlowRole(role: Role | null | undefined): boolean {
  return role === null || role === undefined || role === "BUYER";
}
