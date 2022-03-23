const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: 'development', //development为开发环境 production为生产环境变量 none
    entry: {
        app: './src/index.js',
        hot: 'webpack/hot/dev-server.js',
        client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: false,
        client: false,
    },
    module: {
        rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.(png|jpe?g)$/i,
            //     use: [{
            //         loader: 'image-webp-loader',
            //         options: {
            //             publicPath: '/',
            //             outputPath: resolve(__dirname, './dist'),
            //             name: 'images/[name].[hash].[ext]'
            //         }
            //     }]
            // }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single',
        moduleIds: 'deterministic',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};