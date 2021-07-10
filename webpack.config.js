const path = require('path');
const webpack = require('webpack');



module.exports = {
    entry: './src/Main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: "source-map",
    plugins: [new webpack.ProgressPlugin()],

    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            include: [path.resolve(__dirname, 'src')],
            exclude: [/node_modules/]
        }]
    },

    mode: process.env.mode,

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.html']
    }
}