// 运行环境
export const RUNTIME = process.env.VUE_APP_RUNTIME_ENV
// 开发环境
export const NODE_ENV = process.env.NODE_ENV
// API 请求地址
export const BASE_URL = process.env.VUE_APP_BASE_API


export const WEIX_URL = process.env.VUE_APP_WEIX_API

export const WX_AUTH = process.env.VUE_APP_WX_AUTH

export const DOCUMENT_URL = process.env.VUE_APP_DOCUMENT_API

export const ENV_PREFIX = process.env.VUE_APP_ENV_PREFIX

// 获取文案
export const GETDOCUMENT_URL = process.env.VUE_APP_GETDOCUMENT_API

export const WXPATH= path => WX_AUTH + path

// ios下载链接
export const DOWNLOAD_URL_IOS = 'https://itunes.apple.com/us/app/zhang-tong-jia-yuan-shi-pin-ban/id914847333?l=zh&ls=1&mt=8'
