/**
 * 返回的是一个promise对象
 */
import request from '@/utils/request'
import { BASE_URL, GETDOCUMENT_URL } from '@/config/constants';

// 获取文案
export async function getDocument (param) {
  return request.get(`${GETDOCUMENT_URL}/H5Server/school/getDocumentNew`, param)
}

// 获取安卓下载地址
export async function getAndriodDownloadUrl (param) {
  return request.get(`${BASE_URL}/feServer/config/v1.0`, param)
}

// 任务
export async function getTask (param) {
  return request.post(`${BASE_URL}/score/task/sendTask/v4.0`, param)
}

// 获取微信授权信息
export async function payWechatAuth (param) {
  return request.post(`${BASE_URL}/salesServer/pay/wechat/url/auth`, param)
}

// 获取微信授权配置
export async function payWechatConfig (param) {
  return request.post(`${BASE_URL}/appOpenServer/wx/getJsSdkConfig/v1.0`, param)
}

// 获取分享信息
export async function getScanShareInfo (param) {
  return request.get(`${BASE_URL}/salesServer/app/scan/recharge/shareInfo`, param)
}

// 获取广告数据
export async function getAd (param) {
  return request.post(`${BASE_URL}/appOpenServer/ad/post/v1.0`, param, {withCredentials: false})
}
