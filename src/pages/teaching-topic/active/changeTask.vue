<template>
<div class="contain" :class="list.length? '' : 'data-no'">
  <ul class="task-ul">
    <li class="task-li" v-for="(item, index) in list" :key="index">
      <div class="task-left" @click="listIndex = index">
        <i :class="index == listIndex ? 'select' : 'unselect'"></i>
        <img class="icon" :src="item.cover + '?imageView2/2/w/150'" alt="">
        <div class="txt">{{ item.title }}</div>
      </div>
      <div class="btn" @click='lookTaskDetail(item)'>查看</div>
    </li>
  </ul>
  <div v-if="list.length" class="fix" @click="saveTask">更换</div>
  <no-data v-if="dataFlag"></no-data>
</div>
</template>
<script>
import { taskList, changeTask } from '@/services/index'
import { getUrlParam } from 'szyutils'
import { jsToClient, clientToJs, namespace } from '@/utils/client'
import noData from './components/no-data'
import { Toast } from 'vant'
export default {
  name: 'changeTask',
  components: {
    noData
  },
  data () {
    return {
      listIndex: -1,
      list: [],
      templateId: getUrlParam('templateId'),
      dataFlag: false
    }
  },
  mounted () {
    this.pv({
      page: 'replace_parent-child_tasks',
      page_category: 3,
      parm: getUrlParam('teachingActivityId')
    })
    this.getData()
  },
  methods: {
    getData () {
      let parma = {
        teachingActivityId: getUrlParam('teachingActivityId'),
        userId: getUrlParam('userId'),
        teachingActivityJoinId: getUrlParam('teachingActivityJoinId')
      }
      taskList(parma).then(res => {
        if (res.code && res.code !== 10000 ) {
          Toast(res.message)
          return
        }
        this.list = res.templateList
        if (!this.list.length) {
          this.dataFlag = true
          return
        }
        this.listIndex = this.list.findIndex((item)=>{
            return item.templateId == this.templateId
        })
      })
    },
    saveTask () {
      if (this.listIndex === -1) {
        Toast('请选择亲子任务')
        return
      }
      this.ev({
          event_id: 'click_replace_parent-child_task',
          obj_id: getUrlParam('teachingActivityId')
      })
      let parma = {
        teachingActivityJoinId: getUrlParam('teachingActivityJoinId'),
        userId: getUrlParam('userId'),
        templateId: this.list[this.listIndex].templateId
      }
      changeTask(parma).then(res => {
        if (res.code && res.code !== 10000 ) {
          Toast(res.message)
          return
        }
        Toast('更换成功')
        setTimeout(() => {
          if (namespace) {
            jsToClient('jumpTo', {
              action: 'finish',
              data: {}
            })
          } else {
            this.$router.push({ path: '/teaching-topic/plan-course', query: {teachingActivityJoinId: getUrlParam('teachingActivityJoinId')}})
          }
        }, 300)
      }) 
    },
    lookTaskDetail (item) {
      if (namespace) {
        jsToClient('jumpTo', {
            action: 'html',
            data: {
              title: '任务简介',
              url: window.location.origin + '/edge/taskIntroduce?contentId=' + item.templateId + '&contentType=' + item.contentType
            }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contain{
  width: 100%;
  height: 100%;
  background: rgba(242,243,245,0.62);
  padding: 1px;
  .task-ul{
    display: flex;
    flex-direction: column;
    margin: 30px 30px 0;
    padding-bottom: 100px;
    .task-li{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(150,149,149,0.24);
      border-radius: 16px;
      padding: 30px 30px 34px;
      margin-bottom: 20px;
      .task-left{
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
      }
      i{
        width: 36px;
        height: 36px;
      }
      .select{
        background: url('../../../assets/images/teaching-topic/icon_select.png') no-repeat;
        background-size: 36px 36px;
      }
      .unselect{
        background: url('../../../assets/images/teaching-topic/icon_unselect.png') no-repeat;
        background-size: 36px 36px;
      }
      .icon{
        width: 100px;
        height: 100px;
        margin-left: 20px;
        border-radius: 16px;
      }
      .txt{
        font-size: 32px;
        color: #1C1C1C;
        line-height: 48px;
        overflow:hidden; 
        text-overflow:ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
        flex: 1;
        margin-left: 16px;
      }
      .btn{
        width: 120px;
        height: 62px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #00AAFF;
        border-radius: 38px;
        font-size: 30px;
        color: #00AAFF;
        margin-left: 20px;
      }
    }
  }
  .fix{
    position: fixed;
    z-index: 99;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00AAFF;
    font-size: 36px;
    color: #FFFFFF;
    font-weight: bold;
    height: 98px;
  }
}
.data-no{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100;
}
</style>