const { resolve, join } = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const merge = require("webpack-merge");
const pages = require("./webpack.pages.js");
const appDir = resolve(__dirname, "src");
const buildDir = resolve(__dirname, "dist");
const assetsPath = {
  basePath: "assets",
  jsPath: "assets/js",
  cssPath: "assets/css",
  imgPath: "assets/img",
  fontPath: "assets/fonts",
  staticPath: "static",
};
module.exports = merge(pages, {
  context: appDir,
  entry: {
    bundle: "./assets/js/common.ts",
    head: "./assets/js/head.ts",
  },
  output: {
    path: buildDir,
    publicPath: "./",
    filename: join(assetsPath.jsPath, "[name].js"),
    chunkFilename: join(assetsPath.jsPath, "[name]-[hash].bundle.js"),
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
          {
            loader: "eslint-loader",
            options: {
              typeCheck: true,
            },
          },
        ],
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
          },
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                autoprefixer({
                  grid: true,
                  flexbox: true,
                }),
              ],
            },
          },
          "stylus-loader",
        ],
      },
      {
        test: /\.ejs/,
        use: [
          {
            loader: "ejs-loader",
            options: {
              pretty: true,
              root: resolve(appDir, "ejs"),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: assetsPath.imgPath,
          to: assetsPath.imgPath,
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: assetsPath.staticPath,
          to: "",
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: assetsPath.fontPath,
          to: assetsPath.fontPath,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: join(assetsPath.cssPath, "[name].css"),
      chunkFilename: join(assetsPath.cssPath, "[name]-[hash].css"),
      ignoreOrder: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
});
