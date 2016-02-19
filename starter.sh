#!/bin/sh

if [ $(ps aux | grep $USER | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
  export PATH=/usr/local/bin:$PATH
  export NODE_ENV=production
  cd /var/www/placeful-api && pm2 start app.js -i 0 >> forever.log 2>&1
fi
