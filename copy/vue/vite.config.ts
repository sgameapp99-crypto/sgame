import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import https from 'https'
// Element Plus 自動按需導入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '', 'VITE_')
	const host = env.VITE_DEV_HOST || '0.0.0.0'
	const port = Number(env.VITE_DEV_PORT || 5175)
	const previewPort = Number(env.VITE_PREVIEW_PORT || port)
	const proxyTarget = env.VITE_PROXY_TARGET || 'https://10.2.0.2:8080'
	const proxyEnable = env.VITE_PROXY_ENABLE !== 'false'
	const proxySecure = env.VITE_PROXY_SECURE !== 'false'

	// 調試日誌
	console.log('=== Vite 配置調試 ===')
	console.log('Mode:', mode)
	console.log('Proxy Enabled:', proxyEnable)
	console.log('Proxy Secure:', proxySecure)
	console.log('Proxy Target:', proxyTarget)
	console.log('Host:', host)
	console.log('Port:', port)
	console.log('====================')

	// HMR WebSocket 配置
	// 自動檢測: 如果有 VITE_HMR_HOST 就用,否則讓瀏覽器自動決定
	const hmrConfig = env.VITE_HMR_HOST 
		? { host: env.VITE_HMR_HOST, port: Number(env.VITE_HMR_PORT || port) }
		: { clientPort: Number(env.VITE_HMR_PORT || port) }

	// HTTPS 配置
	const useHttps = env.VITE_HTTPS === 'true'
	let httpsConfig: false | { key: Buffer; cert: Buffer } = false
	if (useHttps) {
		try {
			httpsConfig = {
				key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
				cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'))
			}
			console.log('✅ HTTPS 已啟用')
		} catch (error) {
			console.warn('⚠️ SSL certificates not found, falling back to HTTP')
		}
	}

	return {
		plugins: [
			vue(),
			// Element Plus 自動按需導入組件
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
		],
		resolve: {
			alias: {
				'@': '/src'
			}
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						// Vue 核心庫
						'vendor-vue': ['vue', 'vue-router', 'pinia'],
						// 編輯器（TipTap 較大，單獨分離）
						'vendor-editor': [
							'@tiptap/vue-3',
							'@tiptap/starter-kit',
							'@tiptap/extension-link',
							'@tiptap/extension-image',
							'@tiptap/html'
						],
						// HTTP 客戶端
						'vendor-http': ['axios']
						// Element Plus 已改為按需導入，不需要單獨分離
					}
				}
			},
			chunkSizeWarningLimit: 600
		},
		server: {
			host,
			port,
			https: httpsConfig,
			// 允許所有 host,讓 proxy 在公網 IP 下也能工作
			strictPort: false,
			hmr: hmrConfig,
			proxy: proxyEnable
				? (() => {
					const insecureAgent = new https.Agent({ rejectUnauthorized: false })
					const baseProxy = <T extends Record<string, unknown>>(options: T): T & {
						target: string
						changeOrigin: boolean
						secure: boolean
					} => ({
						target: proxyTarget,
						changeOrigin: true,
						secure: proxySecure,
						...(proxySecure ? {} : { agent: insecureAgent }),
						...options
					})

					return {
						'/api': baseProxy({
							ws: true,
							configure: (proxy, options) => {
								proxy.on('proxyReq', (proxyReq, req, res) => {
									console.log('🔄 Proxying:', req.method, req.url, '→', proxyTarget + req.url)
								})
								proxy.on('proxyRes', (proxyRes, req, res) => {
									console.log('✅ Response:', proxyRes.statusCode, req.url)
								})
								proxy.on('error', (err, req, res) => {
									console.error('❌ Proxy Error:', err.message, req.url)
								})
							}
						}),
						'/health': baseProxy({}),
						'/levels': baseProxy({}),
						// 代理靜態資源（頭像等上傳檔案）
						'/uploads': baseProxy({
							configure: (proxy, options) => {
								proxy.on('proxyReq', (proxyReq, req, res) => {
									console.log('🖼️  Proxying static file:', req.method, req.url, '→', proxyTarget + req.url)
								})
								proxy.on('proxyRes', (proxyRes, req, res) => {
									console.log('✅ Static file response:', proxyRes.statusCode, req.url)
								})
								proxy.on('error', (err, req, res) => {
									console.error('❌ Static file proxy error:', err.message, req.url)
								})
							}
						})
					}
				})()
				: undefined
		},
		preview: {
			host,
			port: previewPort,
			hmr: hmrConfig
		}
	}
})

