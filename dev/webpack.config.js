const path = require('path'); // pathモジュール読み込み
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css出力用
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // クリーンアップ用
const CopyPlugin = require('copy-webpack-plugin'); // 画像のコピー用
const ImageminPlugin = require('imagemin-webpack-plugin').default; // 画像の圧縮用
const ImageminMozjpeg = require('imagemin-mozjpeg'); // 画像の圧縮用
const BrowserSyncPlugin = require('browser-sync-webpack-plugin'); // BrowserSync用
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTMLの読みこみ用
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin'); //読み込みファイルを複数指定する
const { htmlWebpackPluginTemplateCustomizer } = require('template-ejs-loader'); // EJS用
const enabledSourceMap = process.env.NODE_ENV !== 'production';

const filePath = {
	ejs: './src/html/',
	sass: './src/assets/sass/',
	js: './src/assets/ts/'
};

/*
  Sass
*/
const entriesSass = WebpackWatchedGlobEntries.getEntries(
	[path.resolve(__dirname, `${filePath.sass}/**/**.scss`)],
	{
		ignore: path.resolve(__dirname, `${filePath.sass}**/_*.scss`)
	}
)();

const cssGlobPlugins = (entriesSass) => {
	return Object.keys(entriesSass).map(
		(key) =>
			new MiniCssExtractPlugin({
				filename: `./assets/css/${key}.css`
			})
	);
};

/*
  Ejs
*/
const entries = WebpackWatchedGlobEntries.getEntries(
	[path.resolve(__dirname, `${filePath.ejs}**/*.ejs`)],
	{
		ignore: path.resolve(__dirname, `${filePath.ejs}**/_*.ejs`)
	}
)();

const htmlGlobPlugins = (entries) => {
	return Object.keys(entries).map(
		(key) =>
			new HtmlWebpackPlugin({
				filename: `./${key}.html`,
				template: htmlWebpackPluginTemplateCustomizer({
					htmlLoaderOption: {
						sources: false, // ファイルの自動読み込み
						minimize: false // 圧縮
					},
					templatePath: `./src/html/${key}.ejs`
				}),
				// ハッシュの値をファイル名に追加
				hash: true,
				// js,css自動出力と圧縮を無効化
				inject: false
			})
	);
};

/*
  Typescript
*/
const entriesTs = WebpackWatchedGlobEntries.getEntries([
	path.resolve(__dirname, `${filePath.js}*.ts`)
])();

const app = {
	entry: entriesTs,
	// 出力先
	output: {
		filename: './assets/js/[name].js',
		clean: true
	},
	// 仮想サーバーの設定
	devServer: {
		// ルートディレクトリの指定
		static: path.resolve(__dirname, 'src'),
		hot: true,
		open: true
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.ejs$/i,
				use: ['html-loader', 'template-ejs-loader']
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				// 対象となるファイル拡張子
				test: /\.(sa|sc|c)ss$/,
				// Sassファイルの読み込みとコンパイル
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					// Cssをバンドルするためのローダー
					{
						loader: 'css-loader',
						options: {
							url: false, // URL
							sourceMap: enabledSourceMap, // sourcemapを有効にする
							importLoaders: 2 // postcss-loader, sass-loader
						}
					},
					// postcss(autoprefixer)の設定
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: enabledSourceMap, // sourcemapを有効にする
							postcssOptions: {
								// ベンダープレフィックスを自動付与
								plugins: [require('autoprefixer')({ grid: true })]
							}
						}
					},
					// SassをCssへ変換するローダー
					{
						loader: 'sass-loader',
						options: {
							sourceMap: enabledSourceMap // sourcemapを有効にする
						}
					}
				]
			}
		]
	},
	// import文でtsファイルを解決するため
	// これを定義しないとimport文で拡張子を書く必要が生まれる。
	resolve: {
		extensions: ['.ts', '.js']
	},
	target: 'web',
	plugins: [
		new CleanWebpackPlugin(),
		...htmlGlobPlugins(entries),
		...cssGlobPlugins(entriesSass),

		new ImageminPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			plugins: [
				ImageminMozjpeg({
					quality: 85,
					progressive: true
				})
			],
			pngquant: {
				quality: '70-85'
			},
			gifsicle: {
				interlaced: false,
				optimizationLevel: 10,
				colors: 256
			},
			svgo: {}
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets/img/'),
					to: './assets/img/'
				}
			]
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 2000,
			server: { baseDir: 'dist' }
		})
	],
	// node_modulesを監視(watch)対象から除外
	watchOptions: {
		ignored: /node_modules/ //正規表現で指定
	}
};

module.exports = app;
