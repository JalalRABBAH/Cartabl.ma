#!/bin/bash
for ip in 112.140.160.26 4.221.162.168 193.24.211.204 208.73.58.222 200.105.94.126 196.127.97.189; do
  echo "=== $ip ==="
  grep -aE "$ip" /var/log/auth.log 2>/dev/null | grep -aE 'Accepted|session opened|Failed password for' | tail -8
done
echo "=== AVANT 22:56 (origine) ==="
grep -aE 'Accepted|session opened for user' /var/log/auth.log 2>/dev/null | grep -vE '196.123.234.163' | tail -30
echo "=== DEBUT LOG ==="
head -5 /var/log/auth.log 2>/dev/null
echo "=== AUTRES LOGS ==="
ls -la /var/log/ | grep -iE 'auth|wtmp|btmp|secure' 2>/dev/null