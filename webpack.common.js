const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath = require('./build').srcPath

 module.exports = {
    entry: {
        index: path.join(srcPath, 'index.js'),
    },
    module: {
        rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    },
    plugins: [
        // 多入口 - 生成 draw.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
            chunks: ['index']
        })
    ]
 };