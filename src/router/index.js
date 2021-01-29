import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index.vue'
Vue.use(Router)

const IndexRoute = {
  path: '/',
  name: 'home',
  component: (resolve) => require(['@/pages/index.vue'], resolve),
  meta: {
    title: 'Welcome'
  }
}
const notFound = {
  path: '*',
  name: 'notFound',
  meta: {
    title: '掌通家园'
  },
  component: (resolve) => require(['@/pages/404'], resolve),
}


let routes = [
  IndexRoute,
]

const routerContext = require.context('./', true, /index\.js$/)
routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  routes = [
    ...routes,
    ...(routerModule.default || routerModule)
  ]
})

routes = [
  ...routes,
  notFound
]

export default new Router({
  base: 'baby-task',
  mode: 'history', // hash history 需要服务端配合重定向
  routes: routes
})
