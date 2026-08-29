const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
async function main() {
  const dup = await p.user.findFirst({ where: { shopSlug: "chez-rachid-cartables-2" }, select: { id: true, email: true, shopName: true } });
  if (!dup) { console.log("No duplicate found"); return; }
  console.log("Deleting:", JSON.stringify(dup));
  await p.product.deleteMany({ where: { sellerId: dup.id } });
  await p.user.delete({ where: { id: dup.id } });
  console.log("Deleted successfully");
}
main().catch(e => { console.error(e.message); process.exit(1); }).finally(() => p.$disconnect());
