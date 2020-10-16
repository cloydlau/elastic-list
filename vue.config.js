const path = require('path')

const externals = process.env.NODE_ENV === 'development' ? {} : {
  'vue': 'vue',
  'element-ui': 'element-ui',
}

module.exports = {
  pages: {
    index: {
      entry: 'demo/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  css: { extract: false },
  publicPath: './',
  outputDir: path.resolve(__dirname, './dist'),
  configureWebpack: {
    output: {
      filename: 'elastic-list.min.js',
      library: 'elastic-list',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      libraryExport: 'default'
    },
    externals
  },
}
