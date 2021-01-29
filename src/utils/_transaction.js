import { getUrlParam } from 'szyutils';
import { getStorage } from './_data';
import { namespace } from '@/utils/client';

/**
 * 微信支付宝判断
 */
export function appEnv() {
  let appEnv = 'app' // 默认APP内
  if (/MicroMessenger/.test(navigator.userAgent)) {
    appEnv = 'wechat'
  } else if (/AlipayClient/.test(navigator.userAgent)) {
    appEnv = 'alipay'
  } else if (getUrlParam('commonScan') || getUrlParam('schoolScan')) { // 非服务端下发
    appEnv = ''
  }
  return appEnv
}

/**
 * 是否在家长端App端内
 */
export const isInApp = /ZhangTongJiaYuanParent/.test(navigator.userAgent)

/**
 * 是否在家长端微信支付宝判断
 */
export function isInAppWxAli() {
  let status = false
  if (/ZhangTongJiaYuanParent/.test(navigator.userAgent) || /MicroMessenger/.test(navigator.userAgent) || /AlipayClient/.test(navigator.userAgent) || namespace ) {
    status = true
  }
  return status
}

/**
 * 获取url参数
 * @param {*} name
 * @param {*} url
 */
export function getPageUrlParam(name, url) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var sps = url ? decodeURIComponent(url).split('?') : window.location.href.split('?')
  var r = sps[1] && sps[1].match(reg)
  if (r) return decodeURIComponent(r[2])
  return ''
}

/**
 * 通过链接判断入口来源
 * 1=Android版 2=掌通币版 3=扫码校园版 4=扫码通用版 8=ios
 * @returns {string}
 */
export function fromTypeParam () {
  let t = 1
  const pageurl = getUrlParam('pageurl') ? decodeURIComponent(getUrlParam('pageurl')) : ''
  if (Number(getUrlParam('isCoinPay')) || Number(getPageUrlParam('isCoinPay', pageurl))) {
    t = 2
  } else if (Number(getUrlParam('schoolScan')) || getStorage('fromType') === 'schoolScan') {
    t = 3
  } else if (Number(getUrlParam('commonScan')) || getStorage('fromType') === 'commonScan') {
    t = 4
  } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    t = 8
  }
  return t
}

/**
 * 判断入口来源
 * 1=家长端 2=微信端 3=阿里 4=其他
 * @returns {string}
 */
export function fromEnvType () {
  let t = 4
  if (namespace) {
    t = 1
  } else if (appEnv() === 'wechat') {
    t = 2
  } else if (appEnv() === 'alipay') {
    t = 3
  }
  return t
}

/**
 * parentAvatar 格式化
 */
export function parentAvatarFmt (parent) {
  if (typeof parent === 'string') {
    const parentType = parent.toLowerCase()
    let parentAvatar = 'otherpeople'
    if (parentType === 'dad' || parentType === 'mom') {
      parentAvatar = parentType
    } else if (parentType === 'yy' || parentType === 'ly') {
      parentAvatar = 'grandpa'
    } else if (parentType === 'nn' || parentType === 'll') {
      parentAvatar = 'grandma'
    } else if (parentType === 'yf' || parentType === 'gg' || parentType === 'bf' || parentType === 'ss' || parentType === 'gf' || parentType === 'jj') {
      parentAvatar = 'moreman'
    } else if (parentType === 'ym' || parentType === 'jiejie' || parentType === 'bm' || parentType === 'shens' || parentType === 'gm' || parentType === 'jm' || parentType === 'saosao') {
      parentAvatar = 'morewomen'
    }
    return require(`../assets/images/avatar/${parentAvatar}.png`)
  } else {
    return require(`../assets/images/avatar/otherpeople.png`)
  }
}
