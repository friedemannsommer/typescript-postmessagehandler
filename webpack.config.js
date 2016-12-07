const path = require('path')
const webpack = require('webpack')

module.exports = {
    target: 'web',
    entry: {
        index: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'PostMessageHandler'
    },
    resolve: {
        root: path.resolve(__dirname, 'src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules|\.d\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
}
