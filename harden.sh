#!/bin/bash
echo "=== UFW (allume le firewall) ==="
ufw default deny incoming
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose
echo "=== REINSTALL PROCPS (top/ps officiels) ==="
apt-get install --reinstall -y procps 2>&1 | tail -2
dpkg --verify procps 2>/dev/null; echo "(aucune sortie = binaries conformes)"
echo "=== ROTATION MDP ROOT ==="
ROOTPW=$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 16)
echo "root:$ROOTPW" | chpasswd
echo "$ROOTPW" > /root/.root_mdp.txt
chmod 600 /root/.root_mdp.txt
echo "root pw -> /root/.root_mdp.txt"
echo "=== ROTATION MDP NODEJS ==="
NODEPW=$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 16)
echo "nodejs:$NODEPW" | chpasswd
echo "nodejs pw -> /root/.nodejs_mdp.txt"
echo "$NODEPW" > /root/.nodejs_mdp.txt
chmod 600 /root/.nodejs_mdp.txt
echo "=== VERIF CRON (stable 3s) ==="
sleep 3; crontab -l 2>&1; ls -la /var/spool/cron/crontabs/ 2>&1
echo "=== DONE_HARDENING ==="