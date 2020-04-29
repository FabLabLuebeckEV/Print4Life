#/bin/bash

cd /var/www/html
npm install
pm2 restart print4life-api
