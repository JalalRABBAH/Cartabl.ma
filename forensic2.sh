#!/bin/bash
echo "=== PS/CURL PKG ==="; dpkg -S /usr/bin/ps /usr/bin/curl 2>/dev/null
echo "=== DPKG VERIFY==="; dpkg --verify procps curl 2>/dev/null; echo "(vide = intact)"
echo "=== ls -la ps/curl ==="; ls -la /usr/bin/ps /usr/bin/curl /bin/ps 2>/dev/null
echo "=== PROFILE LD_PRELOAD ==="; grep -rL 'LD_PRELOAD' /etc/profile.d/ /etc/environment /home/nodejs/.bashrc /home/nodejs/.profile /root/.bashrc /root/.profile 2>/dev/null; grep -rl 'LD_PRELOAD' /etc/profile.d/ 2>/dev/null
echo "=== FILES ATTACHES ==="; ls -la /etc/profile.d/*.sh 2>/dev/null | tail -20
echo "=== CONTENU runfix.sh ==="; cat /home/nodejs/runfix.sh 2>/dev/null | head -60
echo "=== CONTENU clean-keys.sh ==="; cat /home/nodejs/clean-keys.sh 2>/dev/null | head -60
echo "=== AUTRES SCRIPTS nodejs ==="; ls -la /home/nodejs/*.sh 2>/dev/null
echo "=== RETRY RM ==="; rm -f /tmp/kdevtmpfsi /tmp/.systemd-boot.lock 2>&1; mv -f /tmp/kdevtmpfsi /root/kdev.bak 2>&1
echo "=== PM2 APPS ==="; pm2 list 2>/dev/null || echo "pas pm2 pour root"
echo "=== SYSTEMD RUNNING ==="; systemctl list-units --type=service --state=running 2>/dev/null | grep -vE 'systemd|dbus|ssh|nginx|postgres|ollama|cron|snap|getty|network|resolve|timesync|journal|udev|pam|multi|sys\-' | head -20