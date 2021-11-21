const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const webpack = require("webpack");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        // 热模块替换
        new webpack.HotModuleReplacementPlugin(),
    ],
});