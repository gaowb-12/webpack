const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// 提取css（每个chunk包含的css分别提取成chunk）
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//压缩css(webpack5)
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// js压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
    },
    // 生产环境生成source-map外部文件
    devtool: 'source-map',
    optimization:{
        // deterministic 选项有益于长期缓存
        moduleIds: 'deterministic',
        minimize:true, // 启用terserPlugin进行压缩
        minimizer:[
            // 可以自定义压缩插件
            new UglifyJsPlugin({
                sourceMap:true
            }),
            // 压缩css
            new CssMinimizerPlugin()
        ],
    },
    plugins:[
        // 分离css
        new MiniCssExtractPlugin({
            // 将生成的 css 输出到不同的目录中。
            // filename: ({ chunk }) => {return `css/${chunk.name}.css`},
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
    ],
    module:{
        rules:[
            {
                test:/\.s?css$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath: './'
                        },
                    },
                    "css-loader",
                    "sass-loader"
                ]
            },
        ]
    },
});