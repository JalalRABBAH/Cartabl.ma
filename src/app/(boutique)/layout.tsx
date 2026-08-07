import { StoreHeader } from "@/components/storefront/store-header";
import { StoreFooter } from "@/components/storefront/store-footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export default async function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <CartDrawer />
    </div>
  );
}
