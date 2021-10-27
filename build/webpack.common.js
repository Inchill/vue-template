const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin

function resolve (dir) {
  return path.resolve(__dirname, '../', dir)
}

module.exports =  {
  entry: {
    app: resolve('src/main.ts')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('public/index.html')
    }),
    new ForkTsCheckerWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new CleanWebpackPlugin()
  ],
  output: {
    filename: '[name].[contenthash:8].js',
    path: resolve('dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.styl(us)$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              limit: 10240 // Converting to base64 format when the image size is less than 10kb.
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      'router': resolve('src/router'),
      'store': resolve('src/store'),
      'pages': resolve('src/pages'),
      'components': resolve('src/components'),
      'common': resolve('src/common'),
      'public': resolve('public'),
      'dist': resolve('dist'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.ts', '.vue', '.tsx', '.js', '.jsx', '.json']
  }
}
