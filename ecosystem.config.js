'use strict';

module.exports = {
  apps: [{
    name: 'order-management-api',
    script: 'npm',
    args: 'run api-serve',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev'
    },
    env_production: {
      NODE_ENV: 'prod'
    }
  }]
};
