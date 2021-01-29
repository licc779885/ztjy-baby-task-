<template>
  <div class="clockin-rule">
    <img :src="imgUrl" />
  </div>
</template>

<script>
import * as $service from "@/services"
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs } from '@/utils/client'
export default {
  name: "clockInRule",
  components: {},
  data() {
    return {
      imgUrl: decodeURIComponent(getUrlParam('imgUrl'))
    };
  },
  created() {
    if(namespace){
      // 禁用侧滑
      jsToClient('setNavigationControllerPullBackEnabled', {
        disablePullBack: true
      })
      // 头部显示
      jsToClient('updateBarStatus', { 
        type:'topBar',
        visible:true,
        hideSafeAreaLayout:false
      })
      // 页面即将关闭
      clientToJs('viewWillDisappear',() => {
        // 头部隐藏
        jsToClient('updateBarStatus', { 
          type:'topBar',
          visible: false,
          hideSafeAreaLayout: true
        })
      })
    }
  },
  mounted () {

	},
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
.clockin-rule{
  font-size: 28px;
  img{
    max-width: 100%;
    vertical-align: middle;
  }
}
</style>
