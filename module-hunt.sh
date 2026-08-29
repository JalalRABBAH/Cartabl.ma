#!/bin/bash
echo "=== /proc/modules ==="; cat /proc/modules | head -30
echo "=== modules-load.d ==="; ls -la /etc/modules-load.d/ 2>/dev/null; cat /etc/modules-load.d/* 2>/dev/null; echo
echo "=== /etc/modules ==="; cat /etc/modules 2>/dev/null
echo "=== KO recents dans kernel ==="; find /lib/modules/$(uname -r) -name '*.ko*' -newermt '2026-08-01' -ls 2>/dev/null | head
echo "=== KO suspects ailleurs ==="; find / -maxdepth 4 -name '*.ko' -newermt '2026-08-01' 2>/dev/null | grep -vE '/lib/modules|/usr/lib/linux-tools' | head
echo "=== /boot ==="; ls -la /boot/ 2>/dev/null
echo "=== DMESG modules ==="; dmesg 2>/dev/null | grep -iE 'module|\.ko' | tail -15
echo "=== PROBES ==="; mkdir /tmp/probe2 2>&1 && echo "mkdir OK" || echo "mkdir BLOQUE"; echo hi >/tmp/probe2/a 2>&1 && echo "write /tmp/probe2 OK" || echo "write /tmp/probe2 BLOQUE"; echo hi >/var/tmp/a 2>&1 && echo "write var/tmp OK" || echo "write var/tmp BLOQUE"; rm -f /var/tmp/a
echo "=== modprobe.d ==="; ls -la /etc/modprobe.d/ 2>/dev/null
echo "=== systemd-Resolve ==="; systemctl is-active systemd-resolved 2>&1; ls -la /etc/resolv.conf 2>&1