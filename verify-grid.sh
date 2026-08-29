#!/bin/bash
echo '=== Boutique page check ==='
echo '--- 1. ShopProductGrid chunk in HTML:'
curl -sk https://mbag.ma/chez-rachid-cartables -o /root/boutique2.html
grep -c 'ShopProductGrid' /root/boutique2.html
echo '--- 2. ProductCard chunk in HTML:'
grep -c 'ProductCard' /root/boutique2.html
echo '--- 3. Product data in RSC payload (count product names):'
grep -o '"name":"[^"]*"' /root/boutique2.html | wc -l
echo '--- 4. Any JS errors in chunk files:'
grep -l 'ShopProductGrid' /root/cartabl-ma/.next/static/chunks/*.js 2>/dev/null | head -3
echo '--- 5. Client chunk URL for boutique page:'
grep -o '/_next/static/chunks/app/%28boutique%29/%5Bboutique%5D/page[^"]*\.js' /root/boutique2.html | head -1
echo '--- 6. Site still accessible:'
curl -sk -o /dev/null -w 'status:%{http_code}\n' https://mbag.ma/chez-rachid-cartables
