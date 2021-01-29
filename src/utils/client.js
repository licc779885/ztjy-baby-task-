import dsbridge from 'dsbridge'

// 获取命名空间
const namespace = dsbridge.call('getNameSpace') // 获取终端类型 [parent 家长端     gardener 园丁端]

// js调客户端
/**
 * ------常用方法名-----
 * 获取用户信息: getUserInfo
 * 客户端跳转: jumpTo
 * 客户端报数: onStatisticEvent
 * 友盟报数: onUmengEvent
 * */
const jsToClient = (methodName, params) => {
  const para = typeof params === 'string' ? params : JSON.stringify(params)

	return new Promise((resolve, reject) => {

    if (!namespace) {
      reject('请在APP内使用')
    }
	let nativeMethod = namespace + '.' + methodName
    let hasNativeMethod = dsbridge.hasNativeMethod(nativeMethod)
    // console.log('nativeMethod', nativeMethod, hasNativeMethod)
		if (hasNativeMethod) {
			dsbridge.call(nativeMethod, para, res => {
				resolve(res)
      })
		} else {
      console.log('jsToClient error');
      const error = '方法不支持，请使用掌通家园APP打开'
			reject(error)
		}
	})
}

// 客户端调js
const clientToJs = (methodName, callback) => {
	dsbridge.register(namespace + '.' + methodName, res => {
		callback && typeof callback === 'function' && callback(res)
	})
}

// 纯获取用户信息
const getUserInfo = (store) => {
	return new Promise((resolve, reject) => {
		dsbridge.call(namespace + '.getUserInfo', '', res => {
			let userInfo = {}
			try {
        		userInfo = JSON.parse(res)
			} catch (e) {}
			store && store.commit('global/userInfo', userInfo)
			resolve(userInfo)
		})
	})
}

// 刷新token
const refreshToken = (store) => {
	return new Promise((resolve, reject) => {
		dsbridge.call(namespace + '.refreshToken', '', res => {
			res = JSON.parse(res)
			localStorage.setItem('token', 'Bearer ' + res.accessToken)
			store.commit('global/updateToken', 'Bearer ' + res.accessToken)
			resolve()
		})
	})
}

/**
 * 埋点统计
 * @param {Number} type   1=页面埋点  2=事件埋点  3=广告埋点
 * @param {Object} obj   参数对象
 */
const onStatisticEvent = (type, obj) => {
	let eventId = 'sdo_bfn_pv'
	let umengId = ''
	let umengObj = {}

	if (type === 2) {
		eventId = 'sdo_bfn_event'
		umengId = obj.event_id
	} else if (type === 3) {
	  eventId = 'sdo_bfn_adv'
    umengId = obj.page
  } else {
		umengId = obj.page
	}
	console.log('%c 埋点-' + (type===1?'pv':(type===2?'ev':'adv')), 'color:#0037ff', obj)
	dsbridge.call(namespace + '.onStatisticEvent', JSON.stringify({
		event: eventId,
		data: obj
	}), function () {})

	if (obj.parm !== undefined && obj.parm !== '') {
		umengObj = { eventid: umengId, para: obj.parm }
	} else {
		umengObj = { eventid: umengId }
	}

	dsbridge.call(namespace + '.onUmengEvent', JSON.stringify(umengObj), function () {})
}

export {
	namespace,
	jsToClient,
  	getUserInfo,
	refreshToken,
	clientToJs,
  	onStatisticEvent
}
