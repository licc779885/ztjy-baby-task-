import { getUserInfo } from '@/utils/client'
const state = {
  loading: false,
  inited: false,
  userInfo: {},
  appConfig: {},
  token: ''
}
// getters
const getters = {
  loading: state => state.loading,
  inited: state => state.inited,
  userInfo: state => state.userInfo,
  appConfig: state => state.appConfig,
  token: state => state.token,
  userId: state => state.userInfo.uid,
  schoolId: state => state.userInfo.school_id
}
const actions = {
  login ({ commit, state }, payload) {
    localStorage.setItem('token', JSON.stringify(payload))
    commit('updateToken', payload)
  },
  logout ({ commit, state, dispatch }) {
    localStorage.setItem('token', '')
    commit('updateToken', '')
  },
  getUserInfo ({ commit, state,}){
    return getUserInfo().then((userInfo)=>{
      commit('userInfo', userInfo)
    })
  }
}
// 状态更改的地方
const mutations = {
  updateToken (state, token) {
    state.token = token
  },
  loading (state, type) {
    state.loading = type
  },
  inited (state, type) {
    state.inited = type
  },
  userInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  appConfig (state, appConfig) {
    state.appConfig = appConfig
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
