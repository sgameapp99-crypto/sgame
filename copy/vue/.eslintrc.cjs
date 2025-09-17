module.exports = {
	root: true,
	env: { browser: true, es2021: true, node: true },
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		parser: '@typescript-eslint/parser',
	},
	rules: {
		'vue/multi-word-component-names': 'off',
	},
};
