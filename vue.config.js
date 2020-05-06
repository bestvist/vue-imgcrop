module.exports = {
    outputDir: 'docs',
    pages: {
        index: {
            entry: 'dev/main.ts',
            template: 'dev/index.html',
        }
    },
    productionSourceMap: false,
    css: {
        extract: false
    }
}