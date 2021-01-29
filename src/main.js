import 'lib-flexible'
import Vue from 'vue'
import App from './App'
import router from './router'
import request from './utils/request'
import * as utils from './utils/index'
import store from './store/index'
import pv from './mixins/pv'
import loadding from './mixins/loadding'
// 自动引入global组件
import './components'
import Vant from 'vant';
import 'vant/lib/index.css';
import './styles/index.scss'
Vue.use(Vant)
Vue.mixin(pv)
Vue.mixin(loadding)
// ios 安卓判断
let platform = 'web' // 默认pc web
if (navigator.userAgent.match(/android/i)) {
  platform = 'android'
} else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
  platform = 'ios'
}
Vue.prototype.$appEnv = utils.appEnv()
Vue.prototype.$platform = platform
Vue.prototype.$isInAppWxAli = utils.isInAppWxAli() // fn return true false
Vue.prototype.$request = request
Vue.prototype.$store = store
Vue.prototype.$utils = utils
Vue.prototype.$szyreport = window.szyreport
Vue.config.productionTip = false

window.domain = window.location.origin+'/baby-task'

if (process.env.VUE_APP_RUNTIME_ENV == 'development' || process.env.VUE_APP_RUNTIME_ENV == 'alpha') {
  console.log(process.env.VUE_APP_RUNTIME_ENV)
	const VConsole = require('@/libs/vconsole.min.js')
	// eslint-disable-next-line
	const vConsole = new VConsole()
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || ''
  store.commit('global/updateToken', token)
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  if (!token && to.path !== '/login') {
    if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else if (token && to.path === '/login') {
    router.push('/')
  } else {
    next()
  }
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (process.env.NODE_ENV !== 'production') window.app = app
