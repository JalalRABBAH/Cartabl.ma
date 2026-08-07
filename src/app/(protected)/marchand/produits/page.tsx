import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ProductsManager } from "@/components/merchant/products-manager";
import { toCard } from "@/lib/serialize";

export default async function MerchantProductsPage() {
  const user = await getSessionUser();
  const products = await prisma.product.findMany({
    where: user?.role === "SELLER" ? { sellerId: user.id } : { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ProductsManager
      products={products.map((p) => toCard(p))}
    />
  );
}
