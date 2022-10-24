const { resolve } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development', // 開発モード
  output: {
    path: __dirname + '/dist',
  },
  devtool: 'inline-source-map', // 開発用ソースマップ
  devServer: {
    // hot: true,
    // compress: true,
    // writeToDisk: true,
    // contentBase: resolve(__dirname, 'dist'),
    // watchContentBase: true,
    // open: true,
    // port: 3000,
  },
});
