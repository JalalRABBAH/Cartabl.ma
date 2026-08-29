#!/bin/bash
echo "=== NGINX -T ==="
nginx -T 2>/dev/null | grep -E 'server_name|proxy_pass|listen 80|listen 443' | grep -v '#' | head -40
echo "=== /root/cartabl-ma identité ==="
node -e "const p=require('/root/cartabl-ma/package.json'); console.log('name:',p.name,'| next:',p.dependencies&&p.dependencies.next,'| scripts start:',p.scripts&&p.scripts.start)"
ls -la /root/cartabl-ma/.git 2>/dev/null | head -3 || echo "pas de .git"
git -C /root/cartabl-ma remote -v 2>/dev/null || true
echo "=== HEAD title par port ==="
for prt in 3001 5555 7000 3000; do echo "--- port $prt ---"; curl -s --max-time 5 -H "Host: mbag.ma" http://127.0.0.1:$prt/ 2>/dev/null | grep -oiE '<title>[^<]*</title>|og:site_name[^>]*' | head -3; done
echo "=== HOSTS/DOMAINS nginx ==="
grep -rE 'server_name' /etc/nginx/ 2>/dev/null | grep -v '#' | sort -u | head -20