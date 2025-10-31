const CompressionPlugin = require('compression-webpack-plugin')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: true,
  chainWebpack: (config) => {
    //config.module.rule('images').use('url-loader').loader('url-loader').end()
    // 支持 less 文件的 loader（vue-cli 已自动处理，无需手动加 less-loader）

    config.plugin('compressionPlugin').use(
      new CompressionPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.html$|.\css/, // 匹配文件名
        filename: '[path][base].gz', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 1, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      })
    )
  }
})
