#!/bin/bash
echo "=== UFW STATUS ==="; ufw status verbose 2>/dev/null; echo "---"; nft list ruleset 2>/dev/null | head -30
echo "=== PORTS ECOUTE ==="; ss -ltnp | grep -vE ':22|:80|:443' | head
echo "=== TOUS LES PROCS (via /proc, bypass ps/top) ==="
for d in /proc/[0-9]*; do
  pid=${d#/proc/}
  exe=$(readlink "$d/exe" 2>/dev/null)
  [ -n "$exe" ] && grep -q 'python\|/usr/bin\|/bin\|/tmp\|/var/lib' <<<"$exe" && echo "$pid $exe"
done | sort -k2 | head -40
echo "=== LAST SUCCESS LOGINS ==="
grep -aE 'Accepted|session opened' /var/log/auth.log 2>/dev/null | tail -25
echo "=== CONNECTIONS C2 ?==="; ss -tuap | grep ESTAB | grep -vE ':22|127.0.0.1|::1' | head
echo "=== kill.sh (script user) ==="; cat /home/nodejs/kill.sh 2>/dev/null
echo "=== SYSCTL CHANGES ==="; grep -vE '^#|^$' /etc/sysctl.conf 2>/dev/null
echo "=== APPELS RECENTS ==="; cat /home/nodejs/pm2*.log 2>/dev/null | tail -5
echo "=== etchash ==="; ls -la /var/lib/.cache/ 2>/dev/null