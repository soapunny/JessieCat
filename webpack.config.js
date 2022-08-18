//npm i webpack webpack-cli -D(in devDependencies)
//npm i -D babel-loader
//npm install sass-loader sass webpack --save-dev-
//npm install --save-dev css-loader
//npm install --save-dev style-loader
//npm install --save-dev mini-css-extract-plugin
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS_ROOT = "./src/client/js/";

//path.resolve(__dirname, "assets", "js") => add up the paths together.
module.exports = {
    entry: {
        main: `${BASE_JS_ROOT}main.js`,
        videoPlayer: `${BASE_JS_ROOT}videoPlayer.js`,
        home: `${BASE_JS_ROOT}home.js`,
        recorder: `${BASE_JS_ROOT}recorder.js`,
        commentSection: `${BASE_JS_ROOT}commentSection.js`,
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ],
                  },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",//webpack starts from the back
                ],
            },
        ],
    },
};