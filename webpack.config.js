const path = require("path");

module.exports = {
    target: "web",
    mode: "production",
    entry: {
        index: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        libraryExport: "default",
        library: "PostMessageHandler",
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "eslint-loader",
                },
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            reportFiles: ["./src/**/*.ts"],
                        },
                    },
                ],
            },
        ],
    },
};
