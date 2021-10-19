const path = require('path')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

module.exports = {
    target: 'web',
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: 'PostMessageHandler'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            reportFiles: ['./src/**/*.ts']
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            extensions: ['ts'],
            files: 'src/**/*.ts'
        })
    ]
}
