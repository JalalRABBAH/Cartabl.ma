#!/bin/bash
echo "=== ATTRS FICHIER ==="
lsattr /tmp/.env.local.bak 2>&1
chattr -ia /tmp/.env.local.bak 2>/dev/null
rm -f /tmp/.env.local.bak 2>&1 && echo "ENV_BAK_REMOVED" || echo "ENV_BAK_BLOQUE"
echo "=== SITES (curl local) ==="
for h in "https://127.0.0.1/" "http://127.0.0.1/" "https://127.0.0.1:443/"; do
  code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 8 "$h" 2>/dev/null)
  echo "$h -> $code"
done
echo "=== OLLAMA ==="
curl -s --max-time 5 http://127.0.0.1:11434/api/tags 2>&1 | head -c 300; echo
echo "=== PM2 ==="
pm2 ls 2>/dev/null | grep -E 'online|stopped' | head
echo "=== SS PORT LOCAL 3001 (proxy) ==="
curl -s --max-time 8 -o /dev/null -w '3001 -> %{http_code}\n' http://127.0.0.1:3001/ 2>/dev/null
echo "DONE"