const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "pug/index.pug",
      inject: false,
    }),
  ],
};
