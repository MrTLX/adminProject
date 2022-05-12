const path = require('path')
const FileManagerPlugin = require('filemanager-webpack-plugin') // 将打包后的项目压缩成压缩包
module.exports = {
  lintOnSave: false, //防止eslint语法报错无法编译
  publicPath: '/',
  //打包输出目录
  outputDir: 'dist',
  // 生成版本号
  filenameHashing: true,
  //静态资源目录
  assetsDir: 'static',
  /* webpack-dev-server 相关配置 */
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  },
  /* webpack配置 */
  chainWebpack: (config) => {
    // 别名配置
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('@a', path.resolve(__dirname, './src/assets'))
      .set('@c', path.resolve(__dirname, './src/components'))
  },
  configureWebpack: {
    //webpack的相关配置在这里
    plugins: [
      new FileManagerPlugin({
        //初始化 filemanager-webpack-plugin 插件实例
        events: {
          onEnd: {
            mkdir: ['./dist'], // 不加这行filemanager-webpack-plugin 会报错。原因：dist文件是在打包后生成的，所以压缩时找不到文件报错
            delete: [
              //首先需要删除项目根目录下的zip文件
              './hais1000.zip',
            ],
            archive: [
              //然后我们选择dist文件夹将之打包成zip并放在根目录
              { source: './dist', destination: './hais1000.zip' },
            ],
          },
        },
      }),
    ],
  },
}
