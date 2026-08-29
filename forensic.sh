#!/bin/bash
echo "=== WHO ==="; who
echo "=== LSMOD ==="; lsmod | grep -iE 'kworker|hide|root' | head
echo "=== DIFF MAPS ==="; grep -l libproc /proc/[0-9]*/maps 2>/dev/null
echo "=== PROC SUSPECT ==="; ps auxwwf | grep -iE '\.kworker|\.systemd|kdev|redis-sentinel|\.cache' | grep -v grep | head
echo "=== CONN SORTANTES ==="; ss -tuap | grep ESTAB | grep -v ':22 ' | head -20
echo "=== HISTO ROOT ==="; tail -40 /root/.bash_history 2>/dev/null
echo "=== HISTO NODEJS ==="; tail -20 /home/nodejs/.bash_history 2>/dev/null
echo "=== AT ==="; atq 2>/dev/null
echo "=== TMP2 ==="; ls -la /var/tmp /tmp 2>/dev/null | grep -iE 'kdev|systemd|\.lock|sentinel'
echo "=== RECENT BINAIRE ==="; find /usr/lib /usr/bin /var/lib/.cache /lib -newermt '2026-08-20' -type f 2>/dev/null | grep -vE '\.pyc|\.so\.|/node_modules' | head -30
echo "=== UPTIME/SESSIONS ==="; uptime