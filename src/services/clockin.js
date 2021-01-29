/**
 * 返回的是一个promise对象
 */
import request from '@/utils/request'
import { BASE_URL } from '@/config/constants';

// 获取我的参与
export async function getPartInList (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/my/v1.0`, param)
}
// 视频详情
export async function getVideoInfo (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/taskprogressdetail/view/v1.0`, param)
}
// 视频列表
export async function getVideoList (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/taskprogressdetail/viewlist/v1.0`, param)
}
// 排行版
export async function getRankist (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/rank/v1.0`, param)
}
// 打卡结果详情
export async function getClockInInfo (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/taskprogressdetail/result/v1.0`, param)
}
// 主题详情
export async function getClockInDetail (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/detail/v1.0`, param)
}
// 自己主题详情
export async function getUserClockInDetail (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/joininfo/v1.0`, param)
}
// 作品列表
export async function getClockInDetailList (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/taskprogressdetail/list/v1.0`, param)
}

// 上报浏览
export async function addClockInView (param) {
  return request.post(`${BASE_URL}/growthtask/topictask/view/v1.0`, param)
}

// 点赞
export async function continueLike (param) {
  return request.post(`${BASE_URL}/commentserver/continueLike/v1`, param)
}