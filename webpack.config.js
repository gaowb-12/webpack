const path = require("path");
// 自动引入打包之后的jschunk
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css（每个chunk包含的css分别提取成chunk）
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//压缩css(webpack5)
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// js压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 当前环境
const devMode = false || process.env.NODE_ENV == 'production';

module.exports = {
    mode: "development",
    entry: {
        app: "./src/index.js",
        print:"./src/print.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    // live reloading(实时重新加载) 
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    // devtool设置如何生成souce-map（仅用于开发环境）
    devtool: 'inline-source-map',
    optimization:{
        minimizer:[
            new UglifyJsPlugin({}),
            new CssMinimizerPlugin()
        ],
        // 开发环境压缩需要设置为true，生产环境不需要
        // minimize: true,
        splitChunks: {
            cacheGroups: {
                // 将css提取到一个文件中
                // styles: {
                //     name: 'styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true,
                // },
            },
        },
    },
    module:{
        rules:[
            {
                test:/\.s?css$/,
                use:[
                    !devMode ? {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            publicPath: './'
                        },
                    } : "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                // ****目前发现file-loader与css-loader同时使用存在问题，导致css中的背景图片异常
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: !devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: !devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            title: '管理输出'
        })
    ]
}