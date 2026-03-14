module.exports = {
  apps: [
    {
      name: 'it-tool-backend',
      script: './backend/server.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'it-management-app',
      script: 'npm',
      args: 'run start',
      cwd: './app',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
