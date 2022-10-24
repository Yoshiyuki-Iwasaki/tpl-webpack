const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'production', // 本番モード
  devtool: 'eval',
  output: {
    path: __dirname + '/prod',
  },
});
