import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckoutForm } from "./checkout-form";
import { GuestBanner } from "@/components/storefront/guest-banner";

export default async function CheckoutPage() {
  const session = await getSessionUser();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, email: true, phone: true, city: true, address: true },
      })
    : null;
  return (
    <>
      {!user && (
        <div className="container-site pt-8">
          <GuestBanner />
        </div>
      )}
      <CheckoutForm user={user} />
    </>
  );
}
