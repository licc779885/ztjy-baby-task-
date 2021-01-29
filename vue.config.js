// vue.config.js
// https://cli.vuejs.org/zh/config/#vue-config-js
// https://cli.vuejs.org/zh/guide/webpack.html
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
function resolve (dir) {
	return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/baby-task',
	assetsDir: 'static', // 打包后静态资源路径
	productionSourceMap: false,
  configureWebpack: config => {
    const obj = {}
    if(process.env.NODE_ENV === 'production'){
      Object.assign(obj, {
        devtool: 'eval',
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[hash:8].js'
        },
        performance: {
          hints: false
        },
        optimization: {
          runtimeChunk: {
            name: 'runtime'
          },
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              vant: {
                name: 'chunk-vant', // split vant into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          }
        }
      })
    }
    if (process.env.analyz) {
      Object.assign(obj, {
        plugins: [
          new BundleAnalyzerPlugin()
        ]
      })
    }
    return obj
  },
  devServer: {
    port: 8088,
    open: true,
    proxy: {
      '/app': {
        target: 'http://a.szy.net:4080/salesServer', // 外网联调
        secure: false,
        changeOrigin: true,
      }
    },
    disableHostCheck: true
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // todo
    }
    
  }
}
