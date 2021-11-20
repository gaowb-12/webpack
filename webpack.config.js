const path = require("path");
const webpack = require("webpack");
// 自动引入打包之后的jschunk
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css（每个chunk包含的css分别提取成chunk）
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//压缩css(webpack5)
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// js压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 当前环境
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: "development",
    entry: {
        // 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中
        // 可以应用入口依赖dependOn优化，或者splitChunksPlugin，或者动态导入
        app: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',"./src/index.js"],
        // another: "./src/another-module.js",
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        clean: true,
        publicPath:"/"
    },
    // live reloading(实时重新加载) 
    // devServer: {
    //     static: path.join(__dirname, 'dist'),
    //     compress: true,
    //     port: 9000,
    //     hot: true,
    // },
    // devtool设置如何生成souce-map（仅用于开发环境）
    devtool: 'inline-source-map',
    optimization:{
        // 使用入口依赖做代码分离时，需要这样设置
        runtimeChunk: "single",
        minimizer:[
            new UglifyJsPlugin({}),
            new CssMinimizerPlugin()
        ],
        // 开发环境压缩需要设置为true，生产环境不需要
        // minimize: true,
        // 拆包处理配置
        // splitChunks: {
        //     chunks: "all",
        //     // 缓存组，splitChunks就是根据缓存组的配置去进行拆包处理
        //     cacheGroups: {
        //         // 将所有的css Chunk提取到一个文件中
        //         // styles: {
        //         //     name: "styles",
        //         //     type: "css/mini-extract",
        //         //     chunks: "all",
        //         //     enforce: true,
        //         // },
        //     },
        // },
    },
    module:{
        rules:[
            {
                test:/\.s?css$/,
                use:[
                    devMode ? {
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
        // 分离css
        new MiniCssExtractPlugin({
            // 将生成的 css 输出到不同的目录中。
            // filename: ({ chunk }) => {return `css/${chunk.name}.css`},
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        // 生成html
        new HtmlWebpackPlugin({
            title: '管理输出'
        }),
        // 热模块替换
        new webpack.HotModuleReplacementPlugin(),
    ]
}