#!/bin/bash
echo "=== GIT dans bac-master ? ==="
ls -la /var/www/bac-master/.git 2>/dev/null | head -5 || echo "pas de .git"
git -C /var/www/bac-master remote -v 2>/dev/null
git -C /var/www/bac-master log --oneline -3 2>/dev/null || echo "pas de log git"
echo "=== OWNER/MODE bac-master ==="
ls -la /var/www/bac-master/ | head -15
echo "=== NGINX VERS QUEL PORT ? ==="
grep -rE 'proxy_pass|listen|server_name' /etc/nginx/sites-enabled/ 2>/dev/null | grep -v '#' | head -40
echo "=== PM2 NODEJS ==="
sudo -u nodejs pm2 jlist 2>/dev/null > /tmp/pm2n.json
node -e "const d=require('/tmp/pm2n.json'); d.forEach(p=>console.log(p.name,'|',p.pm2_env.pm_cwd,'|',p.pm2_env.status,'|',(p.pm2_env.env||{}).PORT||'noPORT'))" 2>/dev/null
echo "=== VERSIONS package.json bac-master ==="
node -e "const p=require('/var/www/bac-master/package.json'); console.log('name:',p.name,'| scripts:',JSON.stringify(p.scripts))" 2>/dev/null