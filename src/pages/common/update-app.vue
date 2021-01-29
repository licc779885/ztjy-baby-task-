<template>
  <div class="page">
   <img class="status-pic" src="../../assets/images/icon_update@2x.png" alt="over">
   <div class="status-desc">您目前使用的APP版本低，请升级后体验</div>
   <div class="btn-update" @click="handleUpdate">立即升级</div>
  </div>
</template>

<script>
import * as $service from "@/services";
import { DOWNLOAD_URL_IOS } from '@/config/constants';
export default {
  data () {
    return {
      apkDownload: ''
    }
  },
  created () {
    this.getAndriodDownload()
  },
  methods: {
    getAndriodDownload () {
      $service.getAndriodDownloadUrl().then(res => {
        this.apkDownload = res.appDownload.parent.zhangtong_download
      })
    },
    handleUpdate() {
      let url = ''
      if (this.$platform === 'ios') {
        url = DOWNLOAD_URL_IOS
      } else {
        url = this.apkDownload
      }
      window.location.href = url
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100%;
  box-sizing: border-box;
  text-align: center;
}
.status-pic {
  width: 376px;
  height: 290px;
  vertical-align: middle;
  margin-top: 270px;
}
.status-desc {
  font-size: 32px;
  color: #333333;
  margin: 60px auto;
}
.btn-update {
  background: #00AAFF;
  width: 380px;
  height: 80px;
  line-height: 80px;
  border-radius: 999px;
  margin: 50px auto;
  font-size: 32px;
  color: #FFFFFF;
}
</style>
