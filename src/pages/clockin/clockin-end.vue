<template>
  <div class="clockin-end" v-if="isshow">
    <div class="end-content">
      <div class="title">达成新成就</div>
      <div class="user">
        <div class="user-imt"><img style="max-width:100%" :src="userMedalStatistics.medalIcon" /></div>
        <div class="user-name">{{userMedalStatistics.medalName}}</div>
        <div class="user-text">
          <div>恭喜你</div>
          <div style="white-space:normal">完成{{topicTask.title}}</div>
        </div>
      </div>
      <div class="tuij" v-if="recommendTopicTasks&&recommendTopicTasks.length>0">
        <div class="tuij-title">打卡推荐</div>
        <div class="tuij-list">
          <div class="lt" v-for="(item,index) in recommendTopicTasks" :key="index" @click="toDetail(item)">
            <div class="lt-title">{{item.title}}</div>
            <div class="lt-tis">来看看其它宝宝的精彩动态吧~<span class="spn">点击前往</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as $service from "@/services"
import { Toast } from 'vant'
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
export default {
  name: "clockInEnd",
  components: {

  },
  data() {
    return {
      isshow: false,
      isnone: false,
      topicTask: {},
      recommendTopicTasks: [],
      userMedalStatistics: {},
      studentId: ''
    };
  },
  created() {
    // 页面埋点
    onStatisticEvent(1, {page_category: 4, page: 'clock_in_complete'})
    // 
    getUserInfo(this.$store).then(userInfo => {
      this.studentId = userInfo.student_uid
      this.getClockInInfo()
    })
  },
  mounted () {

	},
  methods: {
    toDetail(){
      console.log('toDetail')
    },
    // 获取视频列表
    getClockInInfo () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      const params = {
        studentId: this.studentId || '00609cdb56454833b0cc',
        topicId: getUrlParam('topicId') || '2557349ccd484e01b449'
      }
      $service.getClockInInfo(params).then(res => {
        console.log(res)
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
          this.isshow = true
          // 获取主题
          if(res.topicTask){
            this.topicTask = res.topicTask
          }
          // 获取推荐列表
          if(res.recommendTopicTasks&&res.recommendTopicTasks.length>0){
            this.recommendTopicTasks = res.recommendTopicTasks
          }else{
            this.isnone = true
          }
          // 获取勋章
          if(res.userMedalStatistics&&res.userMedalStatistics.length>0){
            this.userMedalStatistics = res.userMedalStatistics[0]
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.clockin-end{
  font-size: 28px;
  padding-top: 50px;
  position: fixed;
  background: rgba(255,209,0,0.4);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .end-content{
    width: 690px;
    height: 1039px;
    background: #fff;
    padding: 40px 30px 0;
    box-sizing: border-box;
    margin: 0 auto;
    color: #1C1C1C;
    .title{
      font-size: 40px;
      line-height: 56px;
      text-align: center;
      font-weight: bold;
    }
    .user{
      text-align: center;
      .user-imt{
        line-height: 0;
        margin: 25px 0;
      }
      .user-name{
        font-size: 32px;
        line-height: 45px;
        font-weight: bold;
        margin: 16px auto;
      }
      .user-text{
        font-size: 24px;
        line-height: 36px;
      }
    }
    .tuij{
      margin-top: 100px;
      .tuij-title{
        font-size: 24px;
        line-height: 36px;
      }
      .tuij-list{
        .lt{
          margin: 16px auto 4px;
          background: #F2F3F5;
          border-radius: 16px;
          padding: 12px 20px 14px 16px;
          position: relative;
          .lt-title{
            line-height: 40px;
            width: 359px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .lt-tis{
            font-size: 24px;
            color: #818D9D;
            margin-top: 4px;
            .spn{
              color: #FFA800;
              padding-left: 10px;
            }
          }
          ::after{
            content: '';
            width: 10px;
            height: 17px;
            background: url("../../assets/images/qinzi/icon_enter_gray.png") no-repeat center;
            background-size: 100%;
            position: absolute;
            right: 20px;
            top: 50%;
            margin-top: -8px;
          }
        }
      }
      .tuij-none{
        font-size: 13px;
        margin-top: 15px;
        color: #FFA800;
      }
    }
  }
  .end-content>div{
    width: 630px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0 auto;
  }
}
</style>
