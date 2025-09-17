// PM2 ecosystem configuration for Vite Vue app
// app:dev     - Vite dev server (HMR)
// app:preview - Vite preview server serving built dist/

module.exports = {
  apps: [
    {
      name: 'app:dev',
      script: 'node',
      args: './node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5175',
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'app:preview',
      script: 'node',
      args: './node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port 5175',
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}


