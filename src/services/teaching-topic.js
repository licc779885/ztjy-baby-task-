import request from '@/utils/request'
import { BASE_URL } from '@/config/constants';


// 获取课程安排
export function getPlan (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/get/v1.0`, param)
}

// 更换班级
export function changeClass (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/changeclass/v1.0`, param)
}

// 更换预计开课时间
export function changeStartTime (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/changestarttime/v1.0`, param)
}

// 获取专题详情
export function getActiveDetail (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/detail/v1.0`, param)
}

// 判断专题参与情况
export function isJoinCheck (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/joincheck/v1.0`, param)
}

// 参与专题
export function joinActive (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/join/v1.0`, param)
}

// 获取课程总结
export function getSummary (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/getsummary/v1.0`, param)
}

// 修改亲子任务开关状态
export function updateSwitch (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/updateswitch/v1.0`, param)
}

// 打卡任务列表
export function taskSuccessList (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/summary/tasklist/v1.0`, param)
}

// 动态回调
export function dynamicCallback (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/dynamiccallback/v1.0`, param)
}

// 更改课程
export function changeCourse (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/changecourse/v1.0`, param)
}

// 更改亲子任务
export function changeTask (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/activityjoin/changetemplate/v1.0`, param)
}

// 课程列表
export function coruseList (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/course/list/v1.0`, param)
}

// 课程详情
export function getCourseDetail (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/course/detail/v1.0`, param)
}

// 模板列表
export function taskList (param) {
    return request.post(`${BASE_URL}/growthtask/teachingactivity/template/list/v1.0`, param)
}