#!/bin/bash
echo "=== CONTENU .env.local.bak (fuite potentielle) ==="
cat /tmp/.env.local.bak 2>&1 | head -30
echo "=== HEALTH PRE-REBOOT ==="
top -n1 -b | head -8
echo "---"
ss -tlnp 2>/dev/null | grep -v '127.0.0.1' | head -10
echo "---"
systemctl is-active nginx 2>&1
echo "---"
pm2 ls 2>/dev/null | head -12