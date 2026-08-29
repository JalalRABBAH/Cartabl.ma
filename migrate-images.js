const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const rows = await p.product.findMany({ where: { imagesJson: "[]" } });
  let count = 0;
  for (const r of rows) {
    const imgs = r.imageUrl ? [r.imageUrl] : [];
    await p.product.update({ where: { id: r.id }, data: { imagesJson: JSON.stringify(imgs) } });
    count++;
  }
  console.log("Migrated", count, "products");
})().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
