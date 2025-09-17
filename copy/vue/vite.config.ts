import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '', 'VITE_')
	const host = env.VITE_DEV_HOST || '0.0.0.0'
	const port = Number(env.VITE_DEV_PORT || 5175)
	const proxyPrefix = env.VITE_PROXY_PREFIX || '/member'
	const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:3000'
	const proxyEnable = env.VITE_PROXY_ENABLE !== 'false'
	const proxySecure = env.VITE_PROXY_SECURE === 'true'
	const proxyChangeOrigin = env.VITE_PROXY_CHANGE_ORIGIN !== 'false'

	return {
		plugins: [vue()],
		server: {
			host,
			port,
			proxy: proxyEnable
				? { [proxyPrefix]: { target: proxyTarget, changeOrigin: proxyChangeOrigin, secure: proxySecure } }
				: undefined
		}
	}
})
