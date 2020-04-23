var path = require("path")

module.exports = {
	target: "electron-renderer",

	entry: {
		"main": "./test/main.js",
		"renderer": "./test/renderer.js"
	},

	node: {
		__dirname: false
	},

	module: {
		rules: [{
			test: /\.m?js$/,
			exclude: /(node_modules)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env"]
				}
			}
		}]
	},

	output: {
		path: path.join(__dirname, "dist", "test")
	}
}
