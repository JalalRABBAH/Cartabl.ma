#!/bin/bash
echo "=== SUPPRESSION REGLE 3001 ==="
ufw delete allow 3001/tcp 2>&1 | tail -2
ufw delete allow 3001 2>&1 | tail -2
echo "=== REPARATION DPKG ==="
dpkg --configure -a 2>&1 | tail -3
echo "=== INSTALL DEPS ==="
apt-get -f install -y 2>&1 | tail -2
echo "=== REINSTALL PROCPS ==="
apt-get install --reinstall -y procps 2>&1 | tail -2
dpkg --verify procps 2>/dev/null; echo "---(vide = ok, sinon top encore modifie)---"
echo "=== SECURITY UPDATE ==="
DEBIAN_FRONTEND=noninteractive apt-get update 2>&1 | tail -2
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y 2>&1 | tail -4
echo "=== FICHER_TMP ==="
ls -la /tmp/kdevtmpfsi /tmp/.systemd-boot.lock 2>&1
echo "=== STATUS FINAL ==="
echo "ok"