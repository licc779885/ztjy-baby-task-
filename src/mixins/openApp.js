import { Toast } from 'vant'
export default {
	mounted () {
    setTimeout(() => {
      this.downloadInit()
      if (document.querySelectorAll('.dl-bottom')[0]) {
        let box = document.querySelectorAll('.dl-bottom')[0]
        box.style.display = 'none'
      }
    }, 2000);
  },
  methods: {
    downloadInit () {
      window.szyDownload.init({
        downLoadInfo: {
          type: 'download_pramiry',
          apkSource: 'youshiyoukeh5',
          parentNode: '.download-info-sdk',
          appType: 'teacher' // teacher 代表需要下载园丁端渠道包，parent代表需要下载家长端渠道包，默认值是parent
        }
      })
    }
  }
}
