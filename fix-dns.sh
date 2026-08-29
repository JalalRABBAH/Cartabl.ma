#!/bin/bash
echo "=== DEMARRAGE systemd-resolved ==="
systemctl start systemd-resolved 2>&1
sleep 2
systemctl is-active systemd-resolved 2>&1
echo "=== RESOLV ==="
if systemctl is-active systemd-resolved >/dev/null 2>&1; then
  ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
else
  echo "nameserver 1.1.1.1" > /etc/resolv.conf
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
fi
cat /etc/resolv.conf
echo "=== TEST DNS ==="
getent hosts mirros.digitalocean.com 2>&1 || getent hosts mirrors.digitalocean.com 2>&1
ping -c1 -W2 1.1.1.1 2>&1 | tail -1 || true