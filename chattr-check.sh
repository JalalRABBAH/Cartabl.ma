#!/bin/bash
echo "=== ATTR. REPERTOIRES ==="
lsattr -d /tmp /var/tmp /dev/shm /root 2>&1
echo "=== STAT DIR ==="
stat -c '%n mode=%A uid=%u' /tmp
echo "=== GETFENFORCE ==="
getenforce 2>&1 | head -1
echo "=== APPARMOR ==="
aa-status 2>&1 | head -5
echo "=== PROTECTED SYSCTL ==="
for f in /proc/sys/fs/protected_fifos /proc/sys/fs/protected_regular /proc/sys/fs/protected_symlinks /proc/sys/fs/protected_hardlinks; do echo "$f = $(cat $f 2>/dev/null)"; done
echo "=== NMNSPACE PID1 ==="
readlink /proc/1/ns/mnt 2>/dev/null; ls -l /proc/1/ns/ 2>/dev/null | head -3