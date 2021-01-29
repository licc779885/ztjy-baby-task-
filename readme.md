# vuejs

## 项目技术栈

vue + vuex + vue-router + axios + vant

## 项目运行

```
# 安转依赖
npm install
# 开发模式
npm start or npm run serve
# 打包发布
npm run build
```

## 项目结构说明

```
.
├── README.md                               说明文档
├── babel.config.js                         babel 配置文件
├── dist                                    打包发布的文件夹
├── package.json                            项目说明及依赖
├── postcss.config.js                       postcss 配置文件
├── .env.development                        开发环境下 vue 配置的变量
├── .env.production                         发布环境下 vue 配置的变量
├── .browserslistrc                         browserslist 配置文件
├── .editorconfig                           editor 配置文件
├── .eslintrc.js                            eslint 配置文件
├── public
│   ├── favicon.ico
│   ├── index.html                          项目入口html
│   └── lib
│       └── viewport-buggyfill.min.js       vw 兼容低版本的Profill脚本，vw 默认兼容iOS8+，安卓4.4+
├── src
│   ├── App.vue                             vue 主入口
│   ├── assets                              静态资源文件夹
│   ├── components                          组件文件夹
│   │   ├── global                          引入到全局的组件，通过index.js自动引入
│   │   └── index.js
│   ├── config                              配置文件夹
│   ├── libs                                一些基础库，目前主要是全局引入 vant-ui
│   │   └── vant-ui.js
│   ├── main.js                             项目入口
│   ├── mixins                              vue mixins，目前主要是混合埋点功能
│   │   └── pv.js
│   ├── mock                                mock 文件夹，由index.js统一暴露，开发环境下有效
│   ├── pages                               视图页面文件夹
│   │   ├── 404.vue
│   │   ├── index.vue                       首页
│   │   ├── common                          公共模块
│   │   ├── recharge                        阳光课堂充值模块
│   │   ├── scanpay                         扫码支付模块
│   │   └── service                         服务协议
│   ├── plugins                             vue 插件文件夹，目前包含vue-bus和开发模式下vuex日志功能
│   │   ├── vue-logger
│   │   │   ├── index.js
│   │   │   └── vue-logger.js
│   │   └── vue-notice
│   │       ├── index.js
│   │       └── vue-notice.js
│   ├── router                              路由配置文件夹，按照子目录文件夹模块化划分，由index.js暴露
│   │   ├── index.js
│   │   ├── common                          通用路由配置
│   │   │   └── index.js
│   │   ├── recharge                        阳光课堂模块路由配置
│   │   │   └── index.js
│   │   ├── scanpay                         扫码支付相关路由配置
│   │   │   └── index.js
│   │   └── service                         服务协议路由配置
│   │       └── index.js
│   ├── services                            向服务端请求数据，可由index.js统一暴露
│   │   ├── index.js
│   │   └── common.js                       通用服务
│   │   └── recharge.js                     充值服务
│   │   └── scanpay.js                      扫码服务
│   │   └── member.js                       会员服务（北分）
│   ├── store                               vuex，由index.js自动引入modules下的vuex数据
│   │   ├── index.js
│   │   └── modules
│   │       └── global.js
│   ├── styles                              一些预置的scss及变量或者函数等
│   └── utils                               公共函数
│       ├── _apiBridge.js                   apiBridge 方法定义
│       ├── _data.js
│       ├── _helper.js
│       ├── _math.js
│       ├── _tool.js
│       ├── client.js                       客户端dsbridge交互封装，引入apiBridge方法
│       ├── index.js                        统一暴露私有函数
│       └── request.js                      基于axios的封装
└── vue.config.js                           webpack的相关的一些配置
```

## APP 唤起（见pages/common/open-app.vue）

- [https://wiki.ztjy61.com/pages/viewpage.action?pageId=7834082](https://wiki.ztjy61.com/pages/viewpage.action?pageId=7834082)
- 
## 线上域名
测试：https://alpha-web.szy.com
RC：https://rc-web.szy.cn
正式：https://web.szy.cn


## 通用组件
file-download 文件下载组件
image-box 图片容器组件
preview-image-full-screen 全屏预览图片组件
select-class 选择任教班级组件
upload-media 上传图片或者视频组件
select-date-range 日期范围选择组件