import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    clean: true,
    declaration: true,
    outDir: 'dist',
    rollup: {
        emitCJS: true,
        esbuild: {
            minify: true,
            platform: 'neutral',
            target: 'node16',
            treeShaking: true
        },
        output: {
            exports: 'named',
            generatedCode: 'es2015'
        }
    }
})
