// PM2 ecosystem configuration for Vite Vue app
// app:dev     - Vite dev server (HMR) on port 5175
// app:preview - Vite preview server serving built dist/ on port 8080

module.exports = {
  apps: [
    {
      name: 'app:dev',
      script: 'node',
      args: './node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5175',
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'development',
        NODE_TLS_REJECT_UNAUTHORIZED: '1',
        NODE_EXTRA_CA_CERTS: '/usr/local/share/ca-certificates/cloudflare-origin-ca.crt',
        VITE_HTTPS: 'true',
        VITE_PROXY_TARGET: 'https://api.sportspro.tw:8080',
        VITE_PROXY_ENABLE: 'true',
        VITE_PROXY_PREFIX: '/api',
        VITE_PROXY_CHANGE_ORIGIN: 'true',
        VITE_PROXY_SECURE: 'true',
        VITE_DEV_HOST: '0.0.0.0',
        VITE_DEV_PORT: '5175',
        VITE_HMR_HOST: '34.80.46.175',
        VITE_HMR_PORT: '5175'
      }
    },
    {
      name: 'app:preview',
      script: 'node',
      args: './node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port 8080',
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'production',
        NODE_EXTRA_CA_CERTS: '/usr/local/share/ca-certificates/cloudflare-origin-ca.crt'
      }
    }
  ]
}


