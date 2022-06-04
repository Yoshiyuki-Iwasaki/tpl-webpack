const { resolve } = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    compress: true,
    writeToDisk: true,
    contentBase: resolve(__dirname, "dist"),
    watchContentBase: true,
    open: true,
    port: 3000,
  },
});
