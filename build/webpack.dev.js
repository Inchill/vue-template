module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    port: 3000
  },
  cache: {
    type: 'filesystem'
  }
}
