#!/bin/bash
CHUNK=$(grep -o '/_next/static/chunks/app/%28boutique%29/%5Bboutique%5D/page-[^"]*\.js' /root/boutique2.html | head -1)
echo "chunk=$CHUNK"
curl -sk -o /dev/null -w 'status:%{http_code} size:%{size_download}\n' "https://mbag.ma${CHUNK}"
echo "--- Check RSC inline data for products section:"
grep -o '"\$L17"[^}]*products' /root/boutique2.html | head -1
echo "--- Check if product data serialized inline:"
grep -o 'cmsi1w' /root/boutique2.html | wc -l
echo "--- pm2 errors after page load:"
tail -5 /root/.pm2/logs/cartabl-ma-error.log 2>/dev/null
