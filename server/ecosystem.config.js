module.exports = {
  apps: [
    {
      name: 'booking-crm-server',
      script: 'src/index.js',
      cwd: '/home/ubuntu/booking-crm-platform/server',
      instances: 1,        // Must stay 1 — socket.io rooms are in-process memory
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
