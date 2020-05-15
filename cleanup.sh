#/bin/bash
if [ -f /var/www/html/package.json ]; then
    rm /var/www/html/package.json
fi
if compgen -G "/var/www/html/dist/*" > /dev/null; then
    rm -r /var/www/html/dist/*
fi