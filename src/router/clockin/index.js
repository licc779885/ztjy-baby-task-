import { WxConf } from '@/utils/wx-conf'
import { getUrlParam } from 'szyutils'
const beforeEnter = async (to, from, next) => {
	const ua = navigator.userAgent.toLowerCase()
	if ((/micromessenger/).test(ua)) {
    await WxConf.init()
  }
  next()
}
export default [
  {
    path: '/clockin/clockin-success',
    name: 'clockInSuccess',
    meta: {
      
    },
    component: () => import('@/pages/clockin/clockin-success'),
    beforeEnter
  },
  {
    path: '/clockin/clockin-end',
    name: 'clockInEnd',
    meta: {
      title: '打卡完成'
    },
    component: () => import('@/pages/clockin/clockin-end')
  },
  {
    path: '/clockin/clockin-partin',
    name: 'clockInPartIn',
    meta: {
      title: '我参与的'
    },
    component: () => import('@/pages/clockin/clockin-partin')
  },
  {
    path: '/clockin/clockin-honor',
    name: 'clockInHonor',
    meta: {
      title: '荣誉榜'
    },
    component: () => import('@/pages/clockin/clockin-honor')
  },
  {
    path: '/clockin/clockin-theme',
    name: 'clockInTheme',
    meta: {
      title: ''
    },
    component: () => import('@/pages/clockin/clockin-theme'),
    beforeEnter
  },
  {
    path: '/clockin/clockin-video',
    name: 'clockInVideo',
    meta: {
      title: '视频'
    },
    component: () => import('@/pages/clockin/clockin-video'),
    beforeEnter
  },
  {
    path: '/clockin/clockin-rule',
    name: 'clockInRule',
    meta: {
      title: '活动规则'
    },
    component: () => import('@/pages/clockin/clockin-rule')
  },
  {
    path: '/clockin/clockin-winners',
    name: 'clockInWinners',
    meta: {
      title: '获奖名单'
    },
    component: () => import('@/pages/clockin/clockin-winners')
  },
  {
    path: '/clockin/clockin-middlePage',
    name: 'clockInMiddlePage',
    meta: {
      title: '加载中'
    },
    component: () => import('@/pages/clockin/clockin-middlePage')
  }
]
