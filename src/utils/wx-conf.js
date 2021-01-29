// import { API } from '@/utils/request'
import { BASE_URL, WXPATH, DOCUMENT_URL } from '@/config/constants'
import { getPageUrlParam } from '@/utils/index'
import request from '@/utils/request'
import Vue from 'vue'

const bus = new Vue()
const WxConf = {
	state: {
		currentUrl: window.location.href,
		jsSdkConfig: BASE_URL + '/appOpenServer/wx/getJsSdkConfig/v1.0',
		wxUserInfo: BASE_URL + '/appOpenServer/wx/getUserInfo/v1.0'
	},
	// 获取微信签名等
	getData (params) {
		return request.post(this.state.jsSdkConfig, params)
	},
	urlParamsDelete (name) {
		const loca = window.location
		const baseUrl = loca.origin + loca.pathname + '?'
		const query = loca.search.substr(1)
		if (query.indexOf(name) > -1) {
			const obj = {}
			const arr = query.split('&')
			for (let i = 0; i < arr.length; i++) {
				arr[i] = arr[i].split('=')
				obj[arr[i][0]] = arr[i][1]
			}
			Reflect.deleteProperty(obj, 'name')
			const url = baseUrl + JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')
			return url
		}
	},
	isTwiceShare () {
		let reg = /isTwiceShare/i
		if (reg.test(this.state.currentUrl)) {
			this.state.currentUrl += '&isTwiceShare=1'
		}
	},
	async getWxUserInfo () {
		// 已保存过微信用户信息
		const wxUserInfo = window.localStorage.getItem('wx_user_info')
		if (wxUserInfo) {
			// window.localStorage.setItem('wx_user_info', JSON.stringify(res))
			return
		}
		const code = getPageUrlParam('code')
		if (code) {
			try {
				const res = await request.get(this.state.wxUserInfo, { code })
				window.localStorage.setItem('wx_user_info', JSON.stringify(res))
			} catch (err) {
				if (err.code === 10001 && err.message === '微信认证失败') {
					// 删除code
					let links = encodeURIComponent(WXPATH(window.location.pathname + window.location.search))
					window.location.href = links.indexOf('code') > -1 ? this.urlParamsDelete(links, 'code') : links
					throw err
				}
			}
		} else {
			let url = encodeURIComponent(WXPATH(window.location.pathname + window.location.search))
			// alert(url)
			window.location.href = BASE_URL + '/appOpenServer/wx/auth/v1.0?redirect_uri=' + url
			let err = 'code不存在'
			throw err
		}
	},
	async init () {
		const { currentUrl } = this.state
		const params = {
			url: currentUrl
		}
		const res = await this.getData(params)
		this.isTwiceShare()
		const data = res || {}
		await this.getWxUserInfo()
		if (!window.wx) {
			return
		}
		window.wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
			timestamp: data.timestamp, // 必填，生成签名的时间戳
			nonceStr: data.noncestr, // 必填，生成签名的随机串
			signature: data.signature, // 必填，签名，见附录1
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'chooseWXPay',
				'closeWindow'
			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		})
		return new Promise(resolve => {
			window.wx.ready(() => {
				bus.$on('setShareData', shareData => {
					const data = {
						title: shareData.title,
						desc: shareData.desc,
						imgUrl: shareData.imgUrl,
						link: currentUrl.indexOf('code') > -1 ? this.urlParamsDelete('code') : window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						success () {
							shareData.success && shareData.success()
						},
						cancel (e) {
							shareData.cancel && shareData.cancel()
						}
					}
					window.wx.onMenuShareAppMessage(data)
					window.wx.onMenuShareTimeline(data)
				})
				bus.$on('callWxPay', params => {
					const { appId, timestamp, nonceStr, package: packAge, signType, paySign, success, cancel, fail } = params
					window.wx.chooseWXPay({
						appId,
						timestamp,
						nonceStr,
						package: packAge,
						signType,
						paySign,
						success,
						cancel,
						fail
					})
				})
				bus.$on('closeWindow', () => {
					window.wx.closeWindow()
				})
				resolve()
			})
		})
	}
}

export {
	bus as WxTools,
	WxConf
}
