<template>
  <div class="clockin-honor">
    <div class="honorRoll-title">
			<div class="honorRoll-titleName">{{topicTask.title}}</div>
			<div class="honorRoll-titleSelect">
				<van-dropdown-menu v-if="topicType==0">
				  <van-dropdown-item v-model="selectVal" :options="selectOption" @change="selectChange" />
				</van-dropdown-menu>
			</div>
		</div>
    <!--  -->
    <div class="honorRoll-tab">
      <van-tabs v-model="indexVal" @click="onClick">
        <van-tab>
          <template #title>获赞排行<van-icon name="question" @click="btnQuestion" /></template>
          <div class="honorRoll-listContent">
            <!-- 我的排名 -->
            <honorMy :currentStudentData="currentStudentData" :indexNum="indexNum" :selectValNum="selectValNum" v-if="honorData.length>0&&JSON.stringify(currentStudent) !== '{}'" @toVideo="toVideo"></honorMy>
            <div class="honorRoll-list" v-if="honorData.length>0">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    offset="50"
                    finished-text="没有更多数据~"
                    @load="onLoad"
                  >
                  <honorList :honorDataArr="honorDataArr" :indexNum="indexNum" :topicTaskData="topicTaskData" :selectValNum="selectValNum" @toVideo="toVideo"></honorList>
                </van-list>
            </div>
          </div>
          <clockInNone v-show="isnone" :noneText='2'></clockInNone>
        </van-tab>
        <van-tab title="打卡排行">
          <div class="honorRoll-listContent">
            <!-- 我的排名 -->
            <honorMy :currentStudentData="currentStudentData" :indexNum="indexNum" :selectValNum="selectValNum" v-if="honorData.length>0&&JSON.stringify(currentStudent) !== '{}'" @toVideo="toVideo"></honorMy>
            <div class="honorRoll-list" v-if="honorData.length>0">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  offset="50"
                  finished-text="没有更多数据~"
                  @load="onLoad"
                >
                  <honorList :honorDataArr="honorDataArr" :indexNum="indexNum" :topicTaskData="topicTaskData" :selectValNum="selectValNum" @toVideo="toVideo"></honorList>
                </van-list>
            </div>
          </div>
          <clockInNone v-show="isnone" :noneText='2'></clockInNone>
        </van-tab>
      </van-tabs>
    </div>
    <praiseRule :tancType="tancShow" @closeTanc="closeTanc"></praiseRule>
  </div>
</template>

<script>
import * as $service from "@/services"
import { Toast } from 'vant'
import clockInNone from './components/clockInNone'
import honorList from './components/honorList'
import honorMy from './components/honorMy'
import praiseRule from './components/praiseRule'
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import { browserInfo } from '@/utils/_tool.js'
export default {
  name: "clockInHonor",
  computed:{
    tancType () {
      return this.tancShow
    },
    honorDataArr () {
      return this.honorData
    },
    indexNum () {
      return this.indexVal
    },
    topicTaskData () {
      return this.topicTask
    },
    currentStudentData () {
      return this.currentStudent
    },
    selectValNum () {
      return this.selectVal
    }
  },
  components: {
    clockInNone,
    honorList,
    honorMy,
    praiseRule
  },
  data() {
    return {
      isnone: false,
			tancShow: false,
			loading: false,
  		finished: false,
      selectVal: parseInt(getUrlParam('range')) || 0,
      topicType: parseInt(getUrlParam('topicType')) || 0,
      todayAttendance: getUrlParam('todayAttendance')?JSON.parse(getUrlParam('todayAttendance')):false,
      topicTaskStatus: getUrlParam('topicTaskStatus'),
      indexVal: 0,
      selectOption:[
        { text: '全国排行', value: 0 },
        { text: '学校排行', value: 2 },
        { text: '班级排行', value: 1 }
      ],
      studentId: getUrlParam('studentId'),
      topicId: getUrlParam('topicId'),
      progressDetailId: getUrlParam('progressDetailId'),
      page: 1,
      pageSize: 20,
      honorData: [],
      honorMyData: '',
      topicTask: {},
      currentStudent: {},
      isIos: false
    };
  },
  created() {
    this.getRankist()
    if(namespace){
      jsToClient('updateBarStatus',{
        type:'topBar',
        visible: true
      })
      // 设置界面恢复展示时自动刷新
      clientToJs('autoRefreshCallback', ()=>{
        jsToClient('updateBarStatus', {
          type:'topBar',
          visible: true
        })
      })
      // 
      jsToClient('jumpTo', {
        action: 'autoRefresh',
        data: {
          'needRefresh': true
        }
      })
      // 页面埋点
      onStatisticEvent(1, {page_category: 4, page: 'billboard'})
      // 标记页面
      jsToClient('jumpTo', {
        action: 'flagPageId',
        data: {
          "id": "pagetheme"
        }
      })
      // 禁用侧滑
      jsToClient('setNavigationControllerPullBackEnabled', {
        disablePullBack: true
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
    const isIos = browserInfo().isIos
    if(isIos){
      this.isIos = true
    }
  },
  mounted () {
    
	},
  methods: {
    selectChange(){
      window.scrollTo(0,0)
      this.page = 1
      this.loading = true
      this.finished = false
      this.isnone = false
      this.honorData = []
      if(this.loading){
        this.onLoad()
      }
      // this.getRankist()
      // 事件埋点
      onStatisticEvent(2, {
        event_id: 'towntalk_billboard_view_click',
        obj_id: this.topicId,
        parm: this.selectVal+1
      })
    },
    onClick(index){
      window.scrollTo(0,0)
      this.indexVal = index
      this.page = 1
      this.loading = true
      this.finished = false
      this.isnone = false
      this.honorData = []
      if(this.loading){
        this.onLoad()
      }
      // this.getRankist()
    },
    onLoad(){
      this.getRankist()
      this.isnone = false
    },
    btnQuestion(){
      this.tancShow = true
      console.log('btnQuestion')
      event.stopPropagation()
    },
    closeTanc(){
      this.tancShow = false
    },
    // 获取视频列表
    getRankist () {
      if(this.page==1){
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:0
        })
      }
      if(this.topicType == 1){
        this.selectVal = 1
      }
      const params = {
        topicId: this.topicId,
        studentId: this.studentId,
        range: this.selectVal,
        type: this.indexVal ? 0 : 1,
        page: this.page,
        size: this.pageSize
      }
      this.page++
      $service.getRankist(params).then(res => {
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
        }
        // 学生排行榜
        if(res.studentStatisticsList){
          this.honorData = this.honorData.concat(res.studentStatisticsList.result)
          this.loading = false
          if(this.honorData.length>0){
            this.isnone = false
            // if(this.honorData.length >= res.studentStatisticsList.totalCount){
            //   this.finished = true
            // }
            if(!res.studentStatisticsList.hasNext){
              this.finished = true
            }
          }else{
            this.isnone = true
            this.finished = true
          }
        }else{
          this.isnone = true
          this.finished = true
        }
        // 获取主题
        if(res.topicTask&&JSON.stringify(res.topicTask) !== "{}"){
          this.topicTask = res.topicTask
        }
        // 当前学生排行榜
        if(res.currentStudentStatistics&&JSON.stringify(res.currentStudentStatistics) !== "{}"){
          this.currentStudent = res.currentStudentStatistics
        }
      })
    },
    // 跳转到视频页
    toVideo(data){
      if(namespace){
        if(this.topicTaskStatus == 2){
          this.todayAttendance = true
        }
        if(data.attendanceDay == 0){
          Toast('您还没有参与当前打卡活动哦')
        }else{
          jsToClient('jumpTo',{
            action: 'gotoPunchCardShortVideoPlayPage',
            data: {
              topicId: this.topicId,
              targetStudentId: data.studentId,
              progressDetailId: '',
              isFromTopicList: true,
              isPunchCard: this.todayAttendance,
              pageNo: 1
            }
          }).then(res => {
            if (res == 'YES') {
              this.page = 1
              this.loading = true
              this.finished = false
              this.isnone = false
              this.honorData = []
              if(this.loading){
                this.onLoad()
              }
            }
          })
        }
        
      }
      // else{
      //   this.$router.push({
      //     path: '/clockin/clockin-video?progressDetailId=' + data.progressDetailId + '&topicId=' + data.topicId + '&targetStudentId=' + this.targetStudentId
      //   })
      // }
    },
  }
};
</script>

<style lang="scss" scoped>
.clockin-honor{
  padding-top: 164px;
  font-size: 28px;
  background: #F8F8F7;
  height: 100%;
  .honorRoll-title{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		height: 88px;
		position: fixed;
		width: 100%;
		left: 0;
    top: 0;
    z-index: 99;
    background: #fff;
    .honorRoll-titleName{
      margin-left: 30px;
      font-size: 34px;
      color: #1C1C1C;
      font-weight: bold;
      width: 480px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .honorRoll-titleSelect{
      margin-right: 30px;
      select{
        width: 170px;
        height: 60px;
        border: 1px solid #ddd;
        border-radius: 10px;
        outline:none
      }
      option{
        outline:none
      }
      /deep/ .van-dropdown-item__content{
        min-height: 320px;
      }
      /deep/ .van-dropdown-menu__bar{
        height: 88px;
      }
      /deep/ .van-dropdown-menu__title{
        background: #F2F3F5;
        font-size: 24px;
        border-radius: 24px;
        padding: 0 0 0 20px;
        height: 48px;
        line-height: 48px;
        width: 156px;
      }
      /deep/ .van-dropdown-menu__title::after{
        border: 5px solid;
        border-color: transparent transparent #000 #000;
        right: 20px;
      }
      /deep/ .van-dropdown-menu__title--active{
        color: #FFA800;
        background: rgba(255,209,0,0.16);
      }
      /deep/ .van-dropdown-item__option--active,
      /deep/ .van-dropdown-item__option--active .van-dropdown-item__icon{
        color: #FFA800;
      }
      /deep/ .van-dropdown-menu__title--active::after{
        border-color: transparent transparent #FFA800 #FFA800;
      }
      /deep/ .van-dropdown-menu__bar{
        background-color:none;
        box-shadow:none;
      }
    }
  }
  .honorRoll-title.iosTitle{
    top: 80px;
  }
  .honorRoll-tab{
    /deep/ .van-tabs__nav{
      height: 75px;
    }
    /deep/ .van-tabs__nav--line{
      padding-bottom: 0;
    }
    /deep/ .van-tabs__line{
      width: 0;
      height: 0;
    }
    /deep/ .van-tab{
      // color: #BBBBBD;
      color: #1C1C1C;
      font-size: 30px;
      height: 100%;
    }
    /deep/.van-icon-question{
        background: url("../../assets/images/qinzi/icon_help_gray.png") no-repeat center;
        background-size: 100%;
        width: 26px;
        height: 26px;
        display: inline-block;
        font-size: 0;
        // margin-left: 10px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -15px;
      }
    /deep/ .van-tab__text--ellipsis{
      display: flex;
      align-items: center;
      margin-top: -10px;
      position: relative;
      padding: 0 36px;
    }
    /deep/ .van-tab--active{
      font-size: 32px;
      background: url("../../assets/images/qinzi/icon_line.png") no-repeat center 35px;
      background-size: 76px;
      font-weight: bold;
    }
    /deep/ .van-tab--active .van-icon-question{
      background: url("../../assets/images/qinzi/icon_help_orange.png") no-repeat center;
      background-size: 100%;
    }
    /deep/ .van-tabs--line .van-tabs__wrap{
        position: fixed;
        left: 0;
        right: 0;
        top: 88px;
        background: #fff;
        z-index: 3;
        height: 76px;
        border-bottom: 1px solid #eee;
        padding: 0 90px;
    }
  }
  /deep/ .van-cell::after{
    display: none;
  }
  /deep/ .van-cell__value{
    display: none;
  }
  .praiseRule{
    z-index: 199;
  }
}
</style>
