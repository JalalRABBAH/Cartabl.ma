import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import { getSellerSubscription, subscriptionStatus } from "@/lib/subscription";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "SELLER") {
    redirect("/compte/connexion");
  }
  const sub = await getSellerSubscription(user.id);
  const status = subscriptionStatus(sub);
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  if (status === "EXPIRED" && pathname !== "/marchand/abonnement") {
    redirect("/marchand/abonnement");
  }
  return <>{children}</>;
}
