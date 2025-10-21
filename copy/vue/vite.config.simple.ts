import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': '/src'
		}
	},
	server: {
		host: '0.0.0.0',
		port: 5175,
		https: {
			key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
			cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'))
		},
		proxy: {
			'/api': {
				target: 'https://10.2.0.2:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path
			},
			'/health': {
				target: 'https://10.2.0.2:8080',
				changeOrigin: true,
				secure: false
			},
			'/levels': {
				target: 'https://10.2.0.2:8080',
				changeOrigin: true,
				secure: false
			}
		}
	}
})






