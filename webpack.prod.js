const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: './',
  },
  plugins: [
    new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(' +
            ['js', 'css'].join('|') +
            ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
    })
  ],
  optimization: {
      runtimeChunk: {
          name: 'manifest'
      },
      sideEffects: true,
      minimize: true,
      noEmitOnErrors: true,
      splitChunks: {
          chunks: 'async', // 必须三选一： "initial" | "all" | "async"
          minSize: 30000, // 最小尺寸
          minChunks: 2, //must be greater than or equal 2. The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
          maxAsyncRequests: 5, // 最大异步请求数
          maxInitialRequests: 3, // 最大初始化请求书
          automaticNameDelimiter: '~',
          name: false, // 名称，此选项可接收 function
          cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
          default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true
              }
          }
      }
  },
});