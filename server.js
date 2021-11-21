/**
 * 使用express webpack-dev-middleware 实现webpack-dev-server同样的热加载功能
 * */
const express = require('express');
const webpack = require('webpack');
// 把 webpack 处理过的文件发送到 server
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.dev.js');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
// 应用热模块替换
app.use(require("webpack-hot-middleware")(compiler,{}));

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});