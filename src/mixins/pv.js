import { jsToClient, namespace } from '@/utils/client'
const szyreport = require('@/libs/szyreport.min')
export default {
	created () {
		// pv报数
	},
	methods: {
		pv (param) {
			if (namespace) {
				jsToClient('onStatisticEvent', {
					event: 'sdo_bfn_pv',
					data: param
				})
			} else {
				let prefixKey = ''// 测试环境'alpha'，线上环境''（选填）
				const environment = process.env.NODE_ENV
				// 判断不同环境配置埋点
				if (environment == 'alpha' || environment == 'development') {
					prefixKey = 'alpha'
				}
				szyreport.reportPV({
					data: param, // 页面报数参数（必填）
					prefix: prefixKey// 测试环境'alpha'，线上环境''（选填）
				})
			}
		},
		ev (param) {
			if (namespace) {
				jsToClient('onStatisticEvent', {
					event: 'sdo_bfn_event',
					data: param
				})
			} else {
				let prefixKey = ''// 测试环境'alpha'，线上环境''（选填）
				const environment = process.env.NODE_ENV
				if (environment == 'alpha' || environment == 'development') {
					prefixKey = 'alpha'
				}
				szyreport.reportEvent({
					data: param, // 页面报数参数（必填）
					prefix: prefixKey// 测试环境'alpha'，线上环境''（选填）
				})
			}
		}
	}
}
