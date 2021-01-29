import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'
import { getUrlParam } from 'szyutils';
import { mixin, setCookie } from '@/utils/index';
import { refreshToken, namespace } from '@/utils/client';
import { BASE_URL } from '@/config/constants';
import router from '@/router/index'

// https://github.com/axios/axios
axios.defaults.timeout = 20000 // 请求超时20s
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : BASE_URL

// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
const ua = window.navigator.userAgent.toLowerCase()
if (/micromessenger/.test(ua)) {
  console.log('我是微信环境')
  // 微信端厦门接口添加openId
  axios.interceptors.request.use(conf => {
    if (window.location.pathname.includes('/clockin/clockin-video')) {
      const wxUserInfo = window.localStorage.getItem('wx_user_info') || '{}'
      const { openid: userId, nickname: nickName, headimgurl: userPic } = JSON.parse(wxUserInfo)
      // if (conf.method.toLocaleLowerCase() === 'post') {
      //   conf.data.userId = userId
      // } else {
      //   conf.params.userId = userId
      // }
    }
    return conf
  })
}


function apiAxios (method, url, params, extend = { showToast: true }) {
  if (params) {
    params = filterNull(params)
  }
  const showToast = extend.showToast
  delete extend.showToast
  let headers =  {
    'Content-Type': 'application/json;charset=utf-8'
  }
  store.commit('global/loading', true)
  return new Promise((resolve, reject) => {
    const _axios = axios(mixin({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? JSON.stringify(params) : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      headers,
      withCredentials: true
    }, extend, true)).then(function (res) {
      const jsessionid = res.headers['jsessionid'] || res.headers['JSESSIONID']
      if (jsessionid) {
        setCookie('JSESSIONID', jsessionid, 1800)
      }
      if (res.status !== 200) {
        showToast && Toast(`status:${res.status},statusText:${res.statusText || '请求失败，请检查服务'}`)
      }
      if (res.data.code === 10000 || res.data.returncode === '10000') { // code !== 10000 需要提示
        resolve(res.data.body)
      } else if (res.data.code === 10005 && namespace) { // token过期
        showToast && Toast('请求过期，请稍后再试')
        resolve(res.data)
        refreshToken(store).then(() => {
        })
      } else {
        res.data.code = res.data.code === 0 ? '0' : res.data.code // code 0 异常捕获
        showToast && res.data.message && Toast(res.data.message)
        resolve(res.data)
      }
    }).catch(function (error) { // out of the range of 2xx
      console.log('apiAxios error', error);
      let res = error.response
      if (res) {
        // 待根据具体接口情况完善授权跳转
        if (res.status === 401) {

        } else {
          showToast && Toast(`status: ${res.status}, statusText:${res.statusText || '请求不存在'}`)
        }
      } else {
        const resError = JSON.stringify(error).toLowerCase()
        if (resError.indexOf('network error') > -1) {
          showToast && Toast('找不到网络，请检查')
          // router.push('/common/no-netwrok')
        } else {
          showToast && Toast('服务异常，请稍后再试')
        }
      }
      reject(error)
    }).finally(() => {
      store.commit('global/loading', false)
    })
  })
}

export default {
  get: function (url, params, extend) {
    return apiAxios('GET', url, params, extend)
  },
  post: function (url, params, extend) {
    return apiAxios('POST', url, params, extend)
  },
  put: function (url, params, extend) {
    return apiAxios('PUT', url, params, extend)
  },
  delete: function (url, params, extend) {
    return apiAxios('DELETE', url, params, extend)
  }
}

//
