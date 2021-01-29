import Vue from 'vue'
import Vuex from 'vuex'
import { createLogger } from '@/plugins/vue-logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: debug,
  // plugins: debug ? [createLogger()] : []
})

// 动态载入
const storeContext = require.context('./modules', true, /\.js$/)

storeContext.keys().forEach(modules => {
  store.registerModule(modules.replace(/(^\.\/)|(\.js$)/g, ''), storeContext(modules).default)
})

export { store }
export default store
