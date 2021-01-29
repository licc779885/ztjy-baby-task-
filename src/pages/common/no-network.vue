<template>
  <div class="page-network">
    <img class="icon-wifi" src="../../assets/images/wifi@2x.png" alt="wifi">
    <div class="net-desc">
      唔，网络好像有问题... <br />
      点击页面重新加载
    </div>
  </div>
</template>

<script>
import * as $service from "@/services";
import { getUrlParam } from 'szyutils';
import { WECHAT } from '@/config/wechat';
import { OPEN_APP, DOWNLOAD_URL_IOS } from '@/config/constants';

export default {
  name: "NoNetwork",
  data() {
    return {

    };
  },
  created() {
  },
  mounted () {

	},
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.page-network {
  background-color: #fff;
  font-family: 'PingFangSC-Regular';
  min-height: 100%;
  text-align: center;
}
.icon-wifi {
  width: 334px;
  height: 194px;
  margin-top: 280px;
}
.net-desc {
  font-size: 32px;
  color: #333333;
}
</style>
