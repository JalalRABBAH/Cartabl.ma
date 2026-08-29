#!/bin/bash
echo "=== RETRAIT ATTR. -ia ==="
chattr -ia /tmp 2>&1 && echo "/tmp -OK"
chattr -ia /var/tmp 2>&1 && echo "/var/tmp -OK"
echo "=== VERIF ==="
lsattr -d /tmp /var/tmp 2>&1
echo "=== PROBE ==="
touch /tmp/probe_ok 2>&1 && echo "WRITE /tmp OK" && rm -f /tmp/probe_ok
echo "=== SUPPRESSION MARQUEURS ==="
rm -f /tmp/kdevtmpfsi /tmp/.systemd-boot.lock 2>&1 && echo "MARKERS REMOVED"
echo "=== LISTE /tmp ==="
ls -la /tmp/ 2>&1 | head -20
echo "=== OTHER DIRS IMMUTABLE ==="
for d in /etc /var/spool/cron /root /usr/bin /home; do lsattr -d "$d" 2>/dev/null | tr '\n' ' '; echo " <- $d"; done
echo "=== DONE ==="