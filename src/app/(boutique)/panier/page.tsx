import { getSessionUser } from "@/lib/auth";
import { CartView } from "./cart-view";

export default async function CartPage() {
  const session = await getSessionUser();
  return <CartView role={session?.role ?? null} />;
}
