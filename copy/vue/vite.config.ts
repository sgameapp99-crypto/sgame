import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 使用簡化別名，避免 Node 相關型別需求

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '', 'VITE_')
	const host = env.VITE_DEV_HOST || '0.0.0.0'
	const port = Number(env.VITE_DEV_PORT || 5175)
	const previewPort = Number(env.VITE_PREVIEW_PORT || port)
	const proxyPrefix = env.VITE_PROXY_PREFIX || '/api'
	const proxyTarget = env.VITE_PROXY_TARGET || 'http://10.10.0.2:8080'
	const proxyEnable = env.VITE_PROXY_ENABLE !== 'false'
	const proxySecure = env.VITE_PROXY_SECURE === 'true'
	const proxyChangeOrigin = env.VITE_PROXY_CHANGE_ORIGIN !== 'false'

	// HMR WebSocket 配置
	const hmrHost = env.VITE_HMR_HOST || '34.80.28.226'
	const hmrPort = Number(env.VITE_HMR_PORT || port)

	// HTTPS 配置
	const useHttps = env.VITE_HTTPS === 'true'
	let httpsConfig = false
	if (useHttps) {
		try {
			httpsConfig = {
				key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
				cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'))
			}
		} catch (error) {
			console.warn('SSL certificates not found, falling back to HTTP')
		}
	}

	return {
		plugins: [vue()],
		resolve: {
			alias: {
				'@': '/src'
			}
		},
		server: {
			host,
			port,
			https: httpsConfig,
			allowedHosts: [

				'localhost',
				'10.1.0.2',    // 前端內網IP
				'127.0.0.1'
			],
			hmr: {
				host: hmrHost,
				port: hmrPort
			},
			proxy: proxyEnable
				? {
					[proxyPrefix]: {
						target: proxyTarget,
						changeOrigin: proxyChangeOrigin,
						secure: proxySecure,
						// 保留完整路徑：不移除 /api 前綴，因為後端路徑就是 /api/auth/register
						// 在 HTTPS 環境下，允許代理到 HTTP 後端（開發環境）
						...(useHttps && { rejectUnauthorized: false })
					},
					'/health': {
						target: proxyTarget,
						changeOrigin: proxyChangeOrigin,
						secure: proxySecure,
						// 在 HTTPS 環境下，允許代理到 HTTP 後端（開發環境）
						...(useHttps && { rejectUnauthorized: false })
					},
					'/static': {
						target: proxyTarget,
						changeOrigin: proxyChangeOrigin,
						secure: proxySecure,
						// 在 HTTPS 環境下，允許代理到 HTTP 後端（開發環境）
						...(useHttps && { rejectUnauthorized: false })
					}
				  }
				: undefined
		},
		preview: {
			host,
			port: previewPort,
			allowedHosts: [
				'34.81.135.104.nip.io',
				'34.80.28.226',
				'localhost',
				'10.1.0.2',    // 前端內網IP
				'127.0.0.1'
			],
			hmr: {
				host: hmrHost,
				port: previewPort
			}
			// preview 模式不需要代理，因為它服務靜態文件
		}
	}
})
