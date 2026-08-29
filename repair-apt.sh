#!/bin/bash
echo "=== 1. dpkg --configure -a ==="
dpkg --configure -a 2>&1 | tail -3
echo "=== 2. apt -f install ==="
DEBIAN_FRONTEND=noninteractive apt-get -f install -y 2>&1 | tail -3
echo "=== 3. reinstall procps + e2fsprogs ==="
DEBIAN_FRONTEND=noninteractive apt-get install --reinstall -y procps e2fsprogs 2>&1 | tail -2
echo "=== 4. verify top/ps ==="
dpkg --verify procps 2>/dev/null | grep -E '/usr/bin/(top|ps)' ; test $? -eq 1 && echo "PROCPS_OK (top/ps conformes)"
echo "=== 5. apt-get update ==="
DEBIAN_FRONTEND=noninteractive apt-get update 2>&1 | tail -2
echo "=== 6. apt-get upgrade (securite) ==="
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y 2>&1 | tail -6
echo "=== 7. FINI ==="
echo "upgradables restants: $(apt list --upgradable 2>/dev/null | grep -c upgradable || echo 0)"