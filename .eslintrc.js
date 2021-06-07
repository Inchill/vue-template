module.exports = {
	'env': {
		'browser': true,
    'es2021': true,
    'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		'plugin:@typescript-eslint/recommended'
  ],
  'parser': 'vue-eslint-parser',
	'parserOptions': {
		'ecmaVersion': 12,
		'parser': '@typescript-eslint/parser',
    'sourceType': 'module'
  },
	'plugins': [
		'vue',
		'@typescript-eslint'
	],
	'rules': {
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
    ],
    '@typescript-eslint/no-var-requires': 0,
    'vue/valid-template-root': false
	}
}
