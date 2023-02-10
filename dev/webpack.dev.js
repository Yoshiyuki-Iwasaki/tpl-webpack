const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	mode: 'development', // 開発モード
	output: {
		path: __dirname + '/dist'
	},
	devtool: 'source-map' // 開発用ソースマップ
});
