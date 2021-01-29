<template>
  <div class="clockin-middle">
    <van-loading size="24px" vertical v-if="isshow">加载中...</van-loading>
  </div>
</template>

<script>
import * as $service from "@/services"
import { getUrlParam, versionCompare } from 'szyutils'
import { DOCUMENT_URL } from '@/config/constants'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import { Loading, Dialog } from 'vant'
export default {
  name: "clockInMiddlePage",
  components: {},
  data() {
    return {
      topicId: getUrlParam('topicId'),
      taskId: getUrlParam('taskId'),
      classId: getUrlParam('classId'),
      schoolId: getUrlParam('schoolId'),
      isshow: true
    };
  },
  created() {
    if(namespace){
      getUserInfo(this.$store).then(userInfo => {
        // 版本大于6.34.0跳转到主题页
        if (versionCompare(userInfo.st.app_ver, '6.34.0') >= 0) {
          clientToJs('autoRefreshCallback', ()=>{
            jsToClient('jumpTo', {
              action: 'finish'
            })
          })
          jsToClient('jumpTo', {
            action: 'autoRefresh',
            data: {
              'needRefresh': true
            }
          })
          if(namespace == 'parent'){ 
            jsToClient('jumpTo', {
              action: 'html',
              data: {
                url: DOCUMENT_URL + '/baby-task/clockin/clockin-theme?topicId=' + this.topicId
              }
            })
            // window.location.replace(DOCUMENT_URL + '/baby-task/clockin/clockin-theme?topicId=' + this.topicId)
          }else if(namespace == 'gardener'){
            jsToClient('jumpTo', {
              action: 'homeTask',
              data: {
                taskId: this.taskId,
                classId: this.classId,
                schoolId: this.schoolId
              }
            })
          }
        }else{
          this.isshow = false
          document.title = '升级提示'
          Dialog.alert({
            message: '只有新版本才能进行当前操作',
          }).then(() => {
            jsToClient('jumpTo', {
              action: 'finish'
            })
          })
        }
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
  .clockin-middle{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }
</style>
