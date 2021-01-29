/**
 * 返回的是一个promise对象
 * DSBridge 客户端与h5交互接口定义 https://wiki.ztjy61.com/pages/viewpage.action?pageId=5183014
 */
import { jsToClient } from '@/utils/client'

// 微信支付，data参数如下
// appId:""//微信注册appid
// nonceStr:""//随机字符串
// package:""
// prepayId:""//预支付ID
// amount:""//金额
// tradeNo:""//商户单号
// paySign:""//支付签名
// partnerId:""//商户ID
// timestamp:""//时间戳
// businessTag:""//业务标签
export async function wxPay (data) {
  return await jsToClient('jumpTo', {
    action: 'wxPay',
    data
  })
}

// 支付宝支付，data参数如下
// amout:""//金额
// tradNo:""//商户单号
// paySign:""//支付签名
// businessTag:""//业务标签
export async function aliPay (data) {
  return await jsToClient('jumpTo', {
    action: 'aliPay',
    data
  })
}

// 跳转到html，data对象参数如下
// "url": "",
// "title": "",
// "needResult": false
// "pageType":"" //主要来处理特殊页面的一些特殊行为
export async function jumpToHtml (data) {
  return await jsToClient('jumpTo', {
    action: 'html',
    data
  })
}

// 更新标题，data对象参数如下
// "title":""
export async function updateTitle (data) {
  return await jsToClient('jumpTo', {
    action: 'updateTitle',
    data
  })
}

// 左上角按钮，data对象参数如下
// "leftHasHide":true,//左上角按钮是否隐藏
// "leftText":"",//左上角文案
// "leftIcon":"",//左上角图片
// "clickAction":"actionName",
// "actionName":{ //action信息见备注  }
export async function topBack (data) {
  return await jsToClient('jumpTo', {
    action: 'topBack',
    data
  })
}

// 关闭当前页面
// "needRefrush": false, 界面结束是否需要刷新上一个界面
// "param": "" 界面结束需要传回上一个界面的参数
export async function finishPage (data) {
  return await jsToClient('jumpTo', {
    action: 'finish',
    data
  })
}

// 前往宝宝视频
export async function toBabyVideo () {
  return await jsToClient('jumpTo', {
    action: 'babyVideo'
  })
}

// 掌通币支付
// "amount":""
export async function coinPay (data) {
  if (!data) return
  return await jsToClient('payService', {
    action: 'coinPay',
    data
  })
}

// 掌通币支付成功
// "url":""
// "pageUrl":""
export async function coinPaySuccess (data) {
  if (!data) return
  return await jsToClient('payService', {
    action: 'coinPaySuccess',
    data
  })
}

// 优惠券管理页
export async function goToCouponManager () {
  return await jsToClient('jumpTo', {
    action: 'goToCouponManager'
  })
}

// 邀请家人
// “source”:xxx, // 来源编号，如33=班级排行榜，点击提升排名
// "isPointTask": 是否属于积分任务
// "comeFromType":// 0=新建、1=充值页面跳入、2=完善家人信息页跳入
export async function inviteFamilyer (data) {
  return await jsToClient('jumpTo', {
    action: 'inviteFamilyer',
    data
  })
}

// 分享 data 示例
// sharePlatform: [
//   {
//     platformName: 'weChat',
//     platformText: '微信好友'
//   }, {
//     platformName: 'friendsCircle',
//     platformText: '朋友圈'
//   }
// ],
// title: '掌通家园大咖直播，快来和育儿大咖直播互动吧！',
// url: Url,
// content: '畅享优质幼教好内容'
export async function openShare (data) {
  return await jsToClient('share', data)
}

// 更新显示标题栏状态
// visible  true显示，false隐藏
export async function updateTitleBar (data) {
  return await jsToClient('updateTitleBar', {
    data
  })
}

// 获取APP配置开关
export async function getAppConfig (data) {
  return await jsToClient('getConfig', data)
}

// 启动沉浸式状态栏（全屏）
export async function enableImmersion () {
  return await jsToClient('jumpTo', {
    action: 'enableImmersion'
  })
}

// 跳转到广告
export function gotoAdvert (data) {
  console.log('广告跳转', data)
  jsToClient('jumpTo', {
    action: 'advertClick',
    data
  })
}
// 获取广告参数
export async function getAdParams() {
  return await jsToClient('getAdParams')
}
