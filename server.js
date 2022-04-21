const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackDevServer = require('webpack-dev-server');

const app = express();
const config = require('./webpack.dev.js');
const compiler = webpack(config);

// `hot` and `client` options are disabled because we added them manually
const server = new webpackDevServer({ hot: false, client: false }, compiler);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

// // 将文件 serve 到 port 3000。
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!\n');
// });

(async() => {
    await server.start();
    console.log('dev server is running');
})();