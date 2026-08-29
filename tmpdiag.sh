#!/bin/bash
echo "=== TOUCH PROBE /tmp ==="; touch /tmp/probe123 2>&1 && echo "WRITE_OK" || echo "WRITE_BLOQUE"
echo "=== DF /tmp ==="; df -Th /tmp 2>/dev/null
echo "=== FINDMNT ==="; findmnt /tmp 2>/dev/null
echo "=== MOUNT tmp ==="; mount | grep -E ' /tmp | /dev/shm | overlay ' | head
echo "=== STAT==="; stat -c '%n inode=%i size=%s modif=%y uid=%u mount=%m' /tmp/kdevtmpfsi /tmp/.systemd-boot.lock
echo "=== DEVSHM ==="; ls -la /dev/shm/ 2>/dev/null | head -20
echo "=== RESOLV.CONF ==="; cat /etc/resolv.conf 2>/dev/null | head -5
echo "=== lsattr -R /tmp ==="; lsattr /tmp/kdevtmpfsi /tmp/.systemd-boot.lock /tmp/probe123 2>&1
echo "=== strace rm (si dispo) ==="; which strace && strace -f -e trace=file,unlink,unlinkat,rename,openat rm /tmp/.systemd-boot.lock 2>&1 | tail -10 || echo "pas de strace"
echo "=== python3 unlink ==="; python3 -c "import os; os.unlink('/tmp/kdevtmpfsi')" 2>&1
echo "=== attr xattr ==="; getfattr -d -m- /tmp/kdevtmpfsi 2>&1 | head