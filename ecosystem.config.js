'use strict';

module.exports = {
  apps: [{
    name: 'order-management-api',
    script: 'npm',
    args: 'run api-serve',
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    cwd: '/home/gitlab-runner/apps/order-management',
    env: {
      NODE_ENV: 'prod',
      NG_PORT: 80
    }
  }]
};
