module.exports = {
  // for pm2 deploy (remote server exec pull and deploy)
  // https://pm2.keymetrics.io/docs/usage/deployment/
  deploy: {
    dashboard: {
      host: '47.90.57.225',
      port: '22',
      user: 'www-data',
      ref: 'origin/dashboard',
      repo: 'git@code.aliyun.com:solidzoro/deploy-leaa.git',
      env: { NODE_ENV: 'production' },
      path: '/var/www/leaa-dashboard',
      'pre-setup': `
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- && 
        pwd && 
        ls -la && 
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- && 
        echo ----DASHBOARD-PRE---- 
      `,
      'post-deploy': `
        echo -------- && 
        pwd && 
        echo - && 
        ls -la && 
        echo --------
      `,
    },
  },
};

// &&
// docker-compose down &&
// docker-compose up
