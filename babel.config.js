module.exports = {
	'presets': [
		[
			'@babel/preset-env',
			{
				'useBuiltIns': 'usage', // import polyfill on demand.
				'corejs': 3
			}
		],
		[
			'@babel/preset-typescript',
			{
				'allExtensions': true
			}
		]
	],
	'plugins': [
		[
			'@babel/plugin-transform-runtime',
			{
				'corejs': 3
			}
		],
		'@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      "import",
      {
        "libraryName": "@nutui/nutui",
        "libraryDirectory": "dist/packages/_es",
        "camel2DashComponentName": false
      },
      'nutui3-vue'
    ],
    [
      "import",
      {
        "libraryName": "@nutui/nutui-taro",
        "libraryDirectory": "dist/packages/_es",
        "camel2DashComponentName": false
      },
      'nutui3-taro'
    ]
	]
}
