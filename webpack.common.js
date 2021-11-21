const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 尝试使用环境变量，否则使用根路径
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
    entry: {
        app: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',"./src/index.ts"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
        }),
        // 这可以帮助我们在代码中安全地使用环境变量
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: ASSET_PATH,
    },
    optimization:{
        // 只导出exports导出并且使用到的成员（polyfill，它影响全局作用域，并且通常不提供 export），
        // 用于treeshaking的优化，也就是不打包没使用过的模块内容
        usedExports: true,
        // 抽离runtime包
        runtimeChunk: "single",
        // 开发环境压缩需要设置为true，生产环境不需要
        // minimize: true,
        // 拆包处理配置
        splitChunks: {
            // chunks: "all",
            // 缓存组，splitChunks就是根据缓存组的配置去进行拆包处理
            cacheGroups: {
                // 将所有的css Chunk提取到一个文件中
                // styles: {
                //     name: "styles",
                //     type: "css/mini-extract",
                //     chunks: "all",
                //     enforce: true,
                // },
                // 将第三方库(library)提取到单独的 vendor chunk 文件中（覆盖掉动态引入的拆包）
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module:{
        rules:[
            {
                test:/\.s?css$/,
                use:[
                    "style-loader",
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
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
};