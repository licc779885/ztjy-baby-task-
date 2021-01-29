<template>
  <div class="page-open">
    <div class="open-main">
      <div class="btn-open" @click="onLaunchApp">打开App</div>
    </div>
    <div class="dl-main">
      <div class="dl-desc">未安装掌通家园，点击下方按钮下载</div>
      <div class="btn-dl" @click="handleDownLoad">下载App</div>
    </div>
    <div class="toast-wrapper" :class="{active:launchFail}">
			<div class="toast">跳转失败，请尝试手动打开APP</div>
		</div>
    <div class="pop-open-tips" v-if="$appEnv === 'wechat' || $appEnv === 'alipay'"></div>
  </div>
</template>

<script>
import * as $service from "@/services";
import { getUrlParam } from 'szyutils';
import { WECHAT } from '@/config/wechat';
import { OPEN_APP, DOWNLOAD_URL_IOS } from '@/config/constants';

export default {
  name: "openApp",
  data() {
    return {
      apkDownload: '',
      base64Param: '',
			target: 0,
			launchFail: false,
			isLaunching: false,
			urlConfig: [
				{
					IOS_PROFILE: 'XMSZYZTJY://',
					AND_PROFILE: 'ztjy://com.seebaby/'
				},
				{
					IOS_PROFILE: 'com.szy.ztjyyd://',
					AND_PROFILE: 'ztjy.teacher.applink://com.yuanding.seebaby/'
				}
			]
    };
  },
  beforeCreate() {
    if (this.$appEnv === 'wechat') {
      const locationHref = window.location.href
      $service.payWechatConfig({
        url: encodeURIComponent(locationHref)
      }).then(res => {
        if (!res.code) {
          wx.config({ // wx 权限初始化
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: WECHAT.config.jsApiList
          })
          wx.ready(function () {  //需在用户可能点击分享按钮前就先调用
            $service.getScanShareInfo({
              url: encodeURIComponent(locationHref)
            }).then(res => {
              wx.updateAppMessageShareData({
                title: res.shareTitle, // 分享标题
                desc: res.shareContent, // 分享描述
                link: res.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: res.sharePic, // 分享图标
                success: function (res) {
                  // console.log('updateAppMessageShareData', res);
                }
              })
            })
          });
        }
      }).catch(err => {
        console.log('payWechatConfig err', err);
      })
    }
  },
  created() {
    window.scrollTo(0,0)
    this.getAndriodDownload()
  },
  mounted () {
		let param = this.$route.query.base64
		if (param) {
			this.base64Param = param
		}
		this.target = this.$route.query.target === '1' ? 1 : 0
		this.launchApp()
	},
  methods: {
    getAndriodDownload () {
      $service.getAndriodDownloadUrl().then(res => {
        this.apkDownload = res.appDownload.parent.zhangtong_download
      })
    },
    launchApp () {
			let {isAndroid} = this.detectVersion()
			let profileURL = isAndroid ? this.urlConfig[this.target].AND_PROFILE : this.urlConfig[this.target].IOS_PROFILE
			let resultURL = profileURL + this.base64Param
			if (isAndroid) {
				let ifr = document.createElement('iframe')
				ifr.setAttribute('src', resultURL)
				ifr.setAttribute('style', 'display:none')
				document.body.appendChild(ifr)
			} else {
				window.location.href = resultURL
			}
		},
		onLaunchApp () {
			if (!this.isLaunching) {
				this.isLaunching = true
				this.launchApp()
				setTimeout(() => {
					this.launchFail = true
					setTimeout(() => {
						this.launchFail = false
						this.isLaunching = false
					}, 2000)
				}, 1000)
			}
		},
		detectVersion () {
			let isAndroid, isIOS, isIOS9, version
			let u = navigator.userAgent
			let ua = u.toLowerCase()

			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // android终端或者uc浏览器
				// Android系统
				isAndroid = true
			}

			if (ua.indexOf('like mac os x') > 0) {
				// ios
				let regStrSaf = /os [\d._]*/gi
				let verinfo = ua.match(regStrSaf)
				version = (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
			}
			let versionStr = version + ''
			if (versionStr !== 'undefined' && versionStr.length > 0) {
				version = parseInt(version)
				if (version >= 8) {
					// ios9以上
					isIOS9 = true
				} else {
					isIOS = true
				}
			}
			return {isAndroid, isIOS, isIOS9}
		},
		// 判断手机上是否安装了app，如果安装直接打开url，如果没安装，执行callback
		openApp (url, callback) {
			let {isAndroid, isIOS, isIOS9} = this.detectVersion()
			if (isAndroid || isIOS) {
				let hasApp = true
				let t = 1000
				let openScript = setTimeout(function () {
					if (!hasApp) {
						callback && callback()
					}
					document.body.removeChild(ifr)
				}, 2000)

				var t1 = Date.now()
				var ifr = document.createElement('iframe')
				ifr.setAttribute('src', url)
				ifr.setAttribute('style', 'display:none')
				document.body.appendChild(ifr)

				let timeout = setTimeout(function () {
					var t2 = Date.now()
					if (t2 - t1 < t + 100) {
						hasApp = false
					}
				}, t)
				console.log(openScript, timeout)
			}

			if (isIOS9) {
				location.href = url
				setTimeout(function () {
					callback && callback()
				}, 2000)
			}
		},
    handleDownLoad () {
      let url = ''
      if (this.$platform === 'ios') {
        url = DOWNLOAD_URL_IOS
      } else {
        url = this.apkDownload
      }
      window.location.href = url
    }
  }
};
</script>

<style lang="scss" scoped>
.page-open {
  background-color: #fff;
  font-family: 'PingFangSC-Regular';
  min-height: 100%;
}
.open-main {
  width: 100%;
  height: 670px;
  background: url('../../assets/images/bg_app@2x.png') center/cover no-repeat;
  position: relative;
  .btn-open {
    color: #00AAFF;
    background-color: #fff;
    width: 500px;
    height: 88px;
    font-size: 32px;
    border-radius: 999px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    bottom: 120px;
    transform: translateX(-50%);
  }
}
.dl-main {
  text-align: center;
  .dl-desc {
    margin-top: 120px;
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
  }
  .btn-dl {
    margin: auto;
    font-size: 32px;
    width: 500px;
    height: 88px;
    border-radius: 999px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00AAFF;
    color: #fff;
  }
}
// 浏览器打开提示
.pop-open-tips {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.60);
  background-image: url('../../assets/images/browser_open@2x.png');
  background-repeat: no-repeat;
  background-position: center 20px;
  background-size: 80% auto;
  z-index: 100;
}
// toast-wraper
.toast-wrapper{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 200;
  .toast {
    font-size: 26px;
    padding: 0 30px;
    height: 56px;
    line-height: 56px;
    box-sizing: border-box;
    border-radius: 28px;
    background: rgba(0, 0, 0, .7);
    color: #ffffff;
  }
  &.active{
    display: flex;
  }
}
</style>
