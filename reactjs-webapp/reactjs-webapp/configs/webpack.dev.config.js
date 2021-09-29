const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['./src/app/App.tsx', 'webpack-hot-middleware/client'],
        vendor: ['react', 'react-dom']
    },
    module: {
        rules: [
            {
                loader: 'ts-loader',
                test: /\.(ts|tsx)$/,
            },
            {
                enforce: "pre",
                loader: "source-map-loader",
                test: /\.js$/
            }
        ]
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'app', 'index.html') }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    }
}
