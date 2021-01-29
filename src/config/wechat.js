export const WECHAT = {
  config: {
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx4d782b2e5d8aa9ce', // 必填，公众号的唯一标识
    jsApiList: [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItem',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay'
    ] // 必填，需要使用的JS接口列表
  }
}