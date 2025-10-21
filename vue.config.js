const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module.rule('images')
      .test(/\.(jpg|png|gif)$/)
      .use('url-loader')
  }
})
