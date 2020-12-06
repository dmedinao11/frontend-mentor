const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: { index: path.resolve(__dirname, "src", "main.ts") },
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource"
			}
		]
	},

	resolve: {
		extensions: [".ts", ".js"]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "index.html"), //source
			filename: "index.html" //destination
		})
	],

	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},

	devServer: {
		compress: true,
		port: 9000
	}
};
