#!/bin/bash
echo "=== PM2 PROCESSES ==="
pm2 jlist 2>/dev/null > /tmp/pm2j.json
node -e "const d=require('/tmp/pm2j.json'); d.forEach(p=>console.log(p.name,'|',p.pm2_env.pm_exec_path,'|',p.pm2_env.pm_cwd,'|',p.pm2_env.status))"
echo "=== APP DIRS ==="
find /home /opt /srv /var/www -maxdepth 4 -name 'package.json' -not -path '*/node_modules/*' 2>/dev/null
echo "=== NODEJS HOME ==="
ls -la /home/nodejs/ 2>/dev/null | head
echo "=== NPM GLOBAL/PM2 USER ==="
ps -eo user,args | grep -E 'pm2|next-server|node ' | grep -v grep | head