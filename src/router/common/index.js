export default [
  {
    path: '/common/open-app',
    name: 'commonOpenApp',
    meta: {
      title: '掌通家园'
    },
    component: () => import('@/pages/common/open-app')
  },
  {
    path: '/common/update-app',
    name: 'commonUpdateApp',
    meta: {
      title: '版本升级'
    },
    component: () => import('@/pages/common/update-app')
  },
  {
    path: '/common/no-netwrok',
    name: 'commonNoNetwork',
    meta: {
      title: ''
    },
    component: () => import('@/pages/common/no-network')
  }
]
