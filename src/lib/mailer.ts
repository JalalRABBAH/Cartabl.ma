const RESEND_ENDPOINT = "https://api.resend.com/emails";
const BLUE = "#1d38d5";
const DARK = "#0f1f66";

function appUrl(): string {
  return (process.env.APP_URL || "https://mbag.ma").replace(/\/$/, "");
}

export function money(n: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} DH`;
}

async function sendRaw(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[mail] skip: RESEND_API_KEY absente");
    return;
  }
  const from = process.env.MAIL_FROM || "Mbag.ma <noreply@mbag.ma>";
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[mail] erreur ${res.status} -> ${to}: ${detail.slice(0, 300)}`);
      return;
    }
    console.log(`[mail] envoye -> ${to} (${subject})`);
  } catch (e) {
    console.error("[mail] exception:", e instanceof Error ? e.message : e);
  }
}

function p(txt: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">${txt}</p>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:10px;font-size:14px;font-weight:bold;">${label}</a>`;
}

function shell(title: string, bodyHtml: string): string {
  const url = appUrl();
  return `<!DOCTYPE html>
<html lang="fr"><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
<tr><td style="background:${BLUE};padding:20px 28px;">
<span style="color:#ffffff;font-size:22px;font-weight:bold;">Mbag<span style="opacity:.75">.ma</span></span>
<span style="display:block;color:#c7d2fe;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Maroc Bag</span>
</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-size:20px;color:${DARK};">${title}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;">
<p style="margin:0;font-size:12px;color:#6b7280;">L'equipe Mbag.ma &mdash; paiement a la livraison, partout au Maroc.</p>
<p style="margin:8px 0 0;font-size:12px;"><a href="${url}" style="color:${BLUE};text-decoration:none;">${url}</a></p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export type OrderItemLite = {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type OrderCore = {
  number: string;
  trackingCode: string;
  customerName: string;
  subtotal: number;
  shippingFee: number;
  total: number;
};

function itemsTable(items: OrderItemLite[], order: OrderCore): string {
  const rows = items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${it.productName} &times; ${it.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${money(it.total)}</td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 14px;">${rows}
<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Sous-total</td><td align="right" style="padding:8px 0;font-size:13px;color:#6b7280;">${money(order.subtotal)}</td></tr>
<tr><td style="padding:4px 0;font-size:13px;color:#6b7280;">Livraison</td><td align="right" style="padding:4px 0;font-size:13px;color:#6b7280;">${order.shippingFee === 0 ? "Offerte" : money(order.shippingFee)}</td></tr>
<tr><td style="padding:10px 0;font-size:15px;font-weight:bold;color:${DARK};">Total (paiement a la livraison)</td><td align="right" style="padding:10px 0;font-size:15px;font-weight:bold;color:${DARK};">${money(order.total)}</td></tr>
</table>`;
}

export function sendWelcomeMail(user: {
  name: string;
  email: string;
  role: "BUYER" | "SELLER" | "DELIVERY" | "ADMIN";
}): void {
  const url = appUrl();
  const roleTxt =
    user.role === "SELLER"
      ? "Votre espace marchand est actif avec 7 jours d'essai offerts : publiez vos premiers sacs des maintenant."
      : user.role === "DELIVERY"
        ? "Votre espace livreur est pret : les commandes de votre ville vous y seront assignees."
        : "Parcourez la boutique, ajoutez vos sacs preferes au panier et payez a la livraison.";
  const html = shell(
    `Bienvenue ${user.name} !`,
    `${p(`Votre compte <strong>${user.email}</strong> vient d'etre cree sur Mbag.ma (Maroc Bag).`)}${p(roleTxt)}${btn(url, "Decouvrir Mbag.ma")}`
  );
  void sendRaw(user.email, "Bienvenue sur Mbag.ma !", html);
}

export function sendProductPublishedMail(
  seller: { name: string; email: string },
  product: { name: string; price: number; slug: string; stock: number }
): void {
  const url = `${appUrl()}/produits/${product.slug}`;
  const html = shell(
    "Produit publie",
    `${p(`Bonjour ${seller.name}, votre produit vient d'etre publie sur Mbag.ma :`)}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 16px;">
     <tr><td style="font-size:14px;font-weight:bold;color:${DARK};">${product.name}</td></tr>
     <tr><td style="font-size:13px;color:#6b7280;padding-top:4px;">Prix : ${money(product.price)} &middot; Stock : ${product.stock}</td></tr>
     </table>
     ${p("Il est des maintenant visible par les acheteurs. Partagez le lien pour booster vos ventes !")}
     ${btn(url, "Voir ma fiche produit")}`
  );
  void sendRaw(seller.email, `Produit publie : ${product.name}`, html);
}

export function sendOrderConfirmationMail(
  to: string,
  order: OrderCore,
  items: OrderItemLite[]
): void {
  const trackUrl = `${appUrl()}/suivi/${order.trackingCode}`;
  const html = shell(
    `Merci pour votre commande ${order.customerName} !`,
    `${p(`Votre commande <strong>${order.number}</strong> est bien recue. Nous la preparons des que possible.`)}
     ${itemsTable(items, order)}
     ${p(`Suivez son parcours en temps reel avec le code <strong>${order.trackingCode}</strong>.`)}
     ${btn(trackUrl, "Suivre ma commande")}`
  );
  void sendRaw(to, `Commande ${order.number} confirmee - Mbag.ma`, html);
}

export function sendResetPasswordMail(
  to: string,
  token: string
): void {
  const url = `${appUrl()}/compte/reinitialiser-mot-de-passe?token=${token}`;
  const html = shell(
    "Réinitialisation de votre mot de passe",
    `${p("Vous avez demandé la réinitialisation de votre mot de passe sur Mbag.ma.")}
     ${p("Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expire dans 1 heure.")}
     ${btn(url, "Réinitialiser mon mot de passe")}
     ${p("<em>Si vous n'avez pas fait cette demande, ignorez cet email.</em>")}`
  );
  void sendRaw(to, "Réinitialisation mot de passe - Mbag.ma", html);
}

const STATUS_FR: Record<string, string> = {
  PENDING: "recue",
  CONFIRMED: "confirmee",
  PREPARING: "en preparation",
  HANDED_TO_DELIVERY: "remise au livreur",
  IN_TRANSIT: "en transit",
  OUT_FOR_DELIVERY: "en cours de livraison",
  DELIVERED: "livree",
  CANCELED: "annulee",
  RETURNED: "retournee",
};

export function sendOrderStatusMail(
  to: string,
  order: OrderCore,
  status: string,
  note?: string | null
): void {
  const trackUrl = `${appUrl()}/suivi/${order.trackingCode}`;
  const label = STATUS_FR[status] ?? status;
  const extra =
    status === "DELIVERED"
      ? p("Merci pour votre confiance ! N'hesitez pas a laisser un avis sur les produits achetes.")
      : status === "CANCELED"
        ? p("Si cette annulation ne vient pas de vous, contactez-nous au plus vite.")
        : "";
  const html = shell(
    `Votre commande ${order.number}`,
    `${p(`Bonne nouvelle : votre commande est <strong>${label}</strong>.`)}
     ${note ? p(`<em>Note : ${note}</em>`) : ""}
     ${extra}
     ${btn(trackUrl, "Suivre ma commande")}`
  );
  void sendRaw(to, `Commande ${order.number} : ${label} - Mbag.ma`, html);
}
