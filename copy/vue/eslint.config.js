import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
	{ ignores: ['node_modules/**', 'public/legacy/**', 'dist/**'] },
	js.configs.recommended,
	...ts.configs.recommended,
	{
		// Vue SFC + TS parsing
		files: ['**/*.vue', '**/*.ts'],
		languageOptions: {
			parser: (await import('vue-eslint-parser')).default,
			parserOptions: {
				parser: (await import('@typescript-eslint/parser')).default,
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				window: 'readonly',
				fetch: 'readonly',
				DOMParser: 'readonly',
				HTMLElement: 'readonly',
				Element: 'readonly',
				location: 'readonly',
				document: 'readonly',
				sessionStorage: 'readonly',
				console: 'readonly',
			},
		},
		plugins: { prettier: prettierPlugin },
		rules: {
			'vue/multi-word-component-names': 'off',
			'prettier/prettier': 'warn',
			'vue/no-v-html': 'warn',
		},
	},
	...pluginVue.configs['flat/recommended'],
	configPrettier,
]
