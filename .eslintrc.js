module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        es6: true,
        node: true,
        commonjs: true
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/member-delimiter-style": 0,
        "@typescript-eslint/explicit-function-return-type": 0
    },
    ignorePatterns: ["dist", "node_modules", "*.js"],
    overrides: [
        {
            files: [
                "src"
            ]
        }
    ]
}