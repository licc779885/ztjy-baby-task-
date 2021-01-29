<template>
  <div class="clockin-theme">
    <clockInTitle @toBack='toBack' :class='{active: srollActive}'></clockInTitle>
    <div v-if="noneTopicTask">
      <clockInNone :noneText="4" id="noneTopicTask"></clockInNone>
    </div>
    <div v-else>
      <div class="theme-rule" @click="toRule" v-if="topicRules&&this.topicType==0">活动规则</div>
      <div class="theme-top">
        <div class="top-beij"></div>
        <div class="top-beijImg">
          <img v-if="topicTask.picture&&topicTask.picture!=''" :src="topicTask.picture" />
          <img v-else :src="require('@/assets/images/qinzi/default_beijImg1.png')" />
        </div>
        <div class="top-title"><span class="text">{{topicTask.title}}</span>
        <template >
          <span v-if="topicTask.isReward && topicTask.status==1" class="unreward">有奖</span>
          <span v-if="topicTask.isReward && topicTask.status==2" @click="toWinner" :class="topicTask.rewardCover ? 'reward' : 'unreward'">{{topicTask.rewardCover ? '查看开奖结果' : '待开奖'}}</span>
        </template>
        </div>
        <div class="top-text">{{topicTask.desp}}</div>
		  <div class="top-dom"><span class="time">{{topicTask.beginDay|changeTime}} ~ {{topicTask.endDay|changeTime}}</span><span class="num">{{topicTask.joinCount|numThousand}}人参与，{{topicTask.viewCount|numThousand}}次浏览</span></div>
        <div class="class-student" v-if='classmateList && classmateList.length && namespace == "parent"'>同班{{classStudent}}正在参与</div>
      </div>
    <!-- 成长助力2.0点赞信息 start-->
    <card-info  v-if="namespace == 'parent'" :topicTaskProgress='topicTaskProgress' :todayAttendance='todayAttendance' :joinStatus='joinStatus' :themeStatus='themeStatus' :isMedalFlag='isMedalFlag' :agreeNum='agreeNum' :totalDay='totalDay' :medal='medal'></card-info>
    <!-- 成长助力2.0点赞信息 end -->
      <!-- <div class="theme-myContent" v-if="namespace&&namespaceType==1">
        <div class="theme-my" id="theme-in" v-if="topicTaskProgress&&topicTask.status==1">
          <div class="my-img">
            <template v-if="topicTaskProgress.studentInfo.userPic">
              <img :src="topicTaskProgress.studentInfo.userPic">
            </template>
            <template v-else>
              <img v-if="topicTaskProgress.studentInfo.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
              <img v-if="topicTaskProgress.studentInfo.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
            </template>
          </div>
          <div class="my-text"><span class="studentName">{{topicTaskProgress.studentInfo.trueName}}</span>已打卡{{topicTaskProgress.attendanceCount}}天，好习惯需要坚持哦！</div>
        </div>
        <div class="theme-my" id="theme-end" v-if="topicTask.status==2&&topicTask.isReward">
          <div v-if="topicTask.rewardCover" @click="toWinner" class="my-text">查看活动结果  看看大奖花落谁家<i class="icon"></i></div>
          <div v-else class="my-text">正在统计获奖结果，请1～2天后再来查看</div>
        </div>
      </div> -->
      <!--  -->
      <van-sticky @scroll="srollFun">
        <div class="tab-content" v-if="namespace">
          <div class="tab-btn content1" :class='{active:isactive==0,iscenter:namespaceType==2}' @click="changeTab(0)"><span class="ct ct1">{{tuijText}}</span></div>
          <div class="tab-btn content2" :class='{active:isactive==1}' @click="changeTab(1)" v-if="namespaceType==1"><span class="ct ct2"><span class="studentName">{{studentNameIn}}</span>的作品</span></div>
        </div>
      </van-sticky>
    <!--  -->
      <div class="theme-tab" :class="{mt:topicTaskContent.joinStatus==0}" :id="statusType">
      <!--  -->
        <div v-if="isactive==0">
          <div class="theme-tuij theme-tablist" :class="{tuijNone:isnone}">
            <van-list
              v-model="loading"
              :finished="finished"
              offset="50"
              finished-text="没有更多数据~"
              @load="onLoad"
            >
              <div class="theme-content">
                <div class="tablist-lf tablist-lt">
                  <!-- 无不展示 -->
                  <themeMy v-if="namespace&&namespaceType==1" :topicTaskContentData="topicTaskContentData" @toVideo="toItemPage" v-show="!topicTaskContentType"></themeMy>
                  <!--  -->
                  <themeListLeft :themeDataEvenArr="themeDataEvenArr" v-if="themeData.length" @toVideo="toItemPage" v-show="!isnone"></themeListLeft>
                </div>
                <div class="tablist-lr tablist-lt">
                  <!--班级获赞荣誉排行，端内才展示，无不展示-->
                  <!-- 提测时添加判断<themeRank v-if="namespace"></themeRank> -->
                  <themeRank :rangeNum="rangeNum" :topicIdVal="topicIdVal" :topicTypeData="topicTypeData" :todayAttendanceType="todayAttendanceType" :topicTaskStatusNum="topicTaskStatusNum" v-if="namespace&&namespaceType==1&&topicTaskStudentStatistics.length" :topicTaskStudentArr="topicTaskStudentArr"></themeRank>
                  <!---->
                  <themeListLeft :themeDataEvenArr="themeDataOddArr" v-if="themeData.length" v-show="!isnone" @toVideo="toItemPage"></themeListLeft>
                </div>
              </div>
            </van-list>
          </div>
          <clockInNone v-show="isnone && topicTaskContentType" :noneText="3"></clockInNone>
        </div>
        <!--  -->
        <div v-if="isactive==1">
          <div class="theme-mywork theme-tablist" v-if="themeData.length>0">
            <van-list
              v-model="loading"
              :finished="finished"
              offset="50"
              finished-text="没有更多数据~"
              @load="onLoad"
            >
              <div class="theme-content">
                <div class="tablist-lf tablist-lt">
                  <themeListLeft :themeDataEvenArr="themeDataEvenArr" v-if="themeData.length" @toVideo="toItemPage"></themeListLeft>
                </div>
                <div class="tablist-lr tablist-lt">
                  <!---->
                  <themeListLeft :themeDataEvenArr="themeDataOddArr" v-if="themeData.length" @toVideo="toItemPage"></themeListLeft>
                </div>
              </div>
            </van-list>
          </div>
          <clockInNone v-show="isnone" :noneText="1"></clockInNone>
        </div>
      <!--  -->
      </div>
      <!--底部按钮-->
      <div class="theme-clockIn">
        <!-- 活动中
          status：1活动中，2活动已结束
          todayAttendance：当天是否已打卡
          finishStatus：0打卡任务未完成，1打卡任务已完成
          namespaceType：1家长端，2园丁端
        -->
        <template v-if="topicTask.status==1&&namespace">
          <div class="clockIn-content clockIn-in" v-if="!todayAttendance&&istodayAttendance&&finishStatus==0&&namespaceType==1" @click="toClickIn">去打卡</div>
          <div class="clockIn-content clockIn-in" v-if="todayAttendance&&finishStatus==0&&namespaceType==1" @click="toInvitation(0)">今日已打卡 邀请点赞</div>
          <div class="clockIn-content clockIn-in" v-if="finishStatus==1&&namespaceType==1" @click="toInvitation(1)">任务已完成～ 邀请点赞</div>
          <div class="clockIn-content clockIn-in" v-if="namespaceType==2" @click="toInvitation(0)">提醒班级学生参与</div>
        </template>
        <!-- 活动已结束 -->
        <template v-if="topicTask.status==2&&namespace">
          <div class="clockIn-content clockIn-end">已结束</div>
        </template>
      </div>
      <!-- 气泡弹窗 -->
      <div class="theme-tanc" v-if="istanc&&namespace&&topicTask.status==1">
        <span class="theme-tanc-text">{{tancText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as $service from "@/services"
import clockInTitle from './components/clockInTitle'
import themeListLeft from './components/themeListLeft'
import clockInNone from './components/clockInNone'
import themeRank from './components/themeRank'
import themeMy from './components/themeMy'
import { Toast, Sticky } from 'vant'
import deviceInfo from '@/utils/device'
import { gotoAdvert, getAdParams } from '@/services/dsApis'
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import { browserInfo } from '@/utils/_tool.js'
import { DOCUMENT_URL } from '@/config/constants'
import { WECHAT } from '@/config/wechat'
import {isPromise} from "@/utils";
import list from "@/pages/teaching-topic/active/list";
const BASE_URL = window.location.origin
const weixImgUrl = require('@/assets/images/qinzi/logo_weix.png')
const isIos = browserInfo().isIos
let weixTitle = '',weixContent = '',weixTitleT = ''
import cardInfo from './components/cardInfo'
import 'animate.css'
export default {
  name: "clockInTheme",
  computed:{
    activeType () {
      return this.indexVal
    },
    topicIdVal () {
      return this.topicId
    },
    rangeNum () {
      return this.range
    },
    topicTaskContentData () {
      return this.topicTaskContent
    },
    topicTaskStudentArr () {
      return this.topicTaskStudentStatistics
    },
    themeDataEvenArr () {
      return this.themeDataArr.filter((item, i) => i % 2 === 0)
    },
    themeDataOddArr () {
      return this.themeDataArr.filter((item, i) => i % 2 !== 0)
    },
    themeDataArr () {
      let themeData = this.themeData
      // console.log('去重', themeData)
      let i = 0;
      let result = []
      let obj = {}
      themeData.map((item, index) => {
        item.listAnAdIndex = index // 包含广告数据索引
        if(!item.advertId){
          item.listIndex = i //不包含广告数据索引
          i += 1
        }
        // 数组去重
        // console.log(this.topicTaskContentData.progressDetailId, themeData[index].progressDetailId)
        if (!obj[themeData[index].progressDetailId] && ((this.topicTaskContentData.progressDetailId !== themeData[index].progressDetailId && !this.indexVal) || this.indexVal)) {
          // 热门作品需要过滤自己最高点赞作品  自己作品不需要
            result.push(themeData[index])
            obj[themeData[index].progressDetailId] = true
        }
      })
      console.log(result)
      return result
    },
    topicTypeData () {
      return this.topicType
    },
    todayAttendanceType () {
      return this.todayAttendance
    },
    topicTaskStatusNum () {
      return this.topicTaskStatus
    }
  },
  filters: {
    numThousand (value) {
      if (value === null || value === '' || value === 0 || value === undefined) {
        return '0'
      }
      if(value<10000){
        value = value
      } else {
        value=(value/10000).toFixed(2)+'万'
      }
      return value
    },
    changeTime (time) {
      let date = new Date(time)
			let y = date.getFullYear()
			let m = date.getMonth() + 1
			m = m < 10 ? ('0' + m) : m
			let d = date.getDate()
			d = d < 10 ? ('0' + d) : d
			return m + '/' + d
    }
  },
  components: {
    clockInTitle,
    themeListLeft,
    clockInNone,
    themeRank,
    themeMy,
    cardInfo
  },
  data() {
    return {
      isMy:true,
      isinFirst:true,
      isin:false,
      isEnd:false,
      loading: false,
      finished: false,
      indexVal:0,
      namespace: namespace,
      namespaceType: 1,
      topicId: getUrlParam('topicId'),
      targetStudentId: getUrlParam('targetStudentId'),  //打卡任务归属学生ID，非当前浏览学生ID
      range: 0,
      page: 1,
      pageSize: 20,
      themeData: [],
      isnone: false,// 是否无数据
      topicTask: {
        title: '',
        desp: '',
        beginDay: '0',
        endDay: '0',
        joinCount: 0,
        viewCount: 0,
        status: 0,
        isReward: false,
        rewardCover: ''
      },
      topicTaskContent: {
        joinStatus: 0,
        progressDetailId: ''
      },
      topicTaskStudentStatistics: [],
      topicTaskProgress: null,
      todayAttendance: false,
      istodayAttendance:false,
      finishStatus:0,  //完成状态0未完成1完成
      istanc: false,
      tancText: '',
      topicRules: false,
      nowDateTime: 0,
      statusType: '',
      studentId: '',
      childId: '',
      classId: '',
      schoolId: '',
      version: '',
      studentName: '',
      studentNameIn: '',
      teacherName: '',
      topicName: '',
      groupId: '@1',  //是否有班级群
      weixUrl: '',
      isactive: 0,
      imgUrl: '',
      ispermissions: false,  //班级群id是否开启
      titleType: 0,
      fromsuccess: getUrlParam('fromsuccess'),
      moduleIdNum: 'jz0020002',
      userId: '',
      isEnableImmersion: false,
      topicType: 0,
      tuijText: '热门推荐',
      progressDetailId: '',
      topicTypeNum: '',
      srollActive: false,
      topicTaskStatus: 1,
      noneTopicTask: false,
      topicTaskContentType: false,
      currentUrl: window.location.href,
      // 成长助力2.0 同班同学详细信息
      classStudent: '',
      classmateList: [],
      joinStatus: null, //主题参与状态：1，已参与；0，未参与
      themeStatus: null, //活动状态0 未开始 1 正常 2 已结束
      isMedalFlag: null, //是否有勋章
      agreeNum: (getUrlParam('agreeNum') * 1) || 0,
      isRefresh: false, //返回页面是否需要刷新
      totalDay: null,
      medal: {}
    };
  },
  created() {
    if(namespace){
      jsToClient('updateBarStatus', {
        type:'topBar',
        visible: false,
        hideSafeAreaLayout: true
      })
      // 设置界面恢复展示时自动刷新
      clientToJs('autoRefreshCallback', ()=>{
        jsToClient('updateBarStatus', {
          type:'topBar',
          visible: false,
          hideSafeAreaLayout: true
        })
      })
      jsToClient('jumpTo', {
        action: 'autoRefresh',
        data: {
          'needRefresh': true
        }
      })
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
      // 1隐藏 0显示
      clientToJs('previousPageNavigationBarStatus',(res) => {
        this.titleType = res
      })
    }else{
      document.title = '打卡话题页'
    }

    if(namespace&&namespace == 'gardener'){
      this.namespaceType = 2
      this.moduleIdNum = 'yd0030002'
      getUserInfo(this.$store).then(userInfo => {
        this.teacherName = userInfo.nickname.substr(0,5)
        if (versionCompare(userInfo.st.app_ver, '6.34.0') >= 0) {
          this.isEnableImmersion = true
        }
      })
    }
    // 班级群权限管控
    jsToClient('isModuleOpen', {
      moduleId: this.moduleIdNum
    }).then(data=>{
      let resData = JSON.parse(data)
      if(resData.result==1){
        this.ispermissions = true
      }
    })
    if(namespace&&this.namespaceType==1){
      getUserInfo(this.$store).then(userInfo => {
        this.studentName = userInfo.babyTrueName.substr(0,5)
        this.studentNameIn = userInfo.babyTrueName
        this.studentId = userInfo.student_uid
        this.childId = userInfo.baby_uid
        this.classId = userInfo.class_uid
        this.schoolId = userInfo.school_id
        this.version = userInfo.st.app_ver
        this.userId = userInfo.uid
        if(this.targetStudentId == ''){
          this.targetStudentId = this.studentId
        }else{
          this.targetStudentId = getUrlParam('targetStudentId')
        }
        if (versionCompare(userInfo.st.app_ver, '6.34.0') >= 0) {
          this.isEnableImmersion = true
        }
        this.getUserClockInDetail()
        this.getClockInDetail()
        this.getStudentInfo()
        this.page = this.page != 1 ? 1 : this.page
        this.onLoad()
      })
    }else{
        this.studentId = getUrlParam('studentId')
        this.childId = getUrlParam('childId')
        this.classId = getUrlParam('classId')
        this.schoolId = getUrlParam('schoolId')
        this.version = getUrlParam('version')
        this.userId = getUrlParam('userId')
        this.studentName = getUrlParam('studentName').substr(0,5)
        this.targetStudentId = getUrlParam('targetStudentId')
        this.teacherName = getUrlParam('teacherName').substr(0,5)
        this.getClockInDetail()
        this.getStudentInfo()
    }
    $service.addClockInView({
      topicId: this.topicId
    })
  },
  mounted () {

	},
  methods: {
    // 统计埋点
    statisticEvent: function (space_id, startTime, status, platform, ad_id = '', ad_location = '') {
      let endTime = +new Date()

      let params = {
        status: status, // 节点状态
        space_id: space_id, // 广告位id
        ad_id: ad_id, // 广告id
        ad_location: ad_location, // 信息流位置
        stay_time: ((endTime - startTime) / 1000).toFixed(3), // 协商时长、曝光时长
        ad_platform: platform, //第三方广告类型
      }
      onStatisticEvent(3, params)
    },
    // 获取广告数据，合并到列表数据
    async getAdData (clockInDetailList = []) { // 列表数据
      console.log('clockInDetailList', clockInDetailList)
      let parm = await getAdParams() || '{}' // 获取ds 广告参数
      if (parm){
        parm = JSON.parse(parm)
      }
      const adParm = {
        space_id: 1015,
        task_id: this.topicId,
        user_info: parm.user_info,
        device_info: parm.device_info,
        feed_max: clockInDetailList.length,
        feed_page: this.page - 1
      }
      // const adParm = {
      //   user_info: {
      //     uid: this.$store.state.global.userInfo.uid || '',// 用户id
      //     schoolid: this.$store.state.global.userInfo.school_id || '', // 宝宝园所id
      //   },
      //   space_id: 1015,
      //   device_info: deviceInfo.getInfo()
      // }
      console.log('请求广告参数', adParm)
      const startTime = + new Date();
      onStatisticEvent(3, {
        status: '1',
        space_id: 1015,
      })
      return $service.getAd(adParm)
        .then(res => {
          console.log('getAd', res)
          if (res.code){
            this.statisticEvent(1015, startTime, '3'); // 报数 - 协商无结果
          } else {
            let adsList = res.ads || [];
            if(adsList.length>0){ // 报数 - 协商有结果
              adsList.forEach(item => {
                this.statisticEvent(1015, startTime, '2', item.platform, item.advertId, item.insertPos);
              })

              if (clockInDetailList && clockInDetailList.length > 0) {
                // let it = JSON.parse(JSON.stringify(adsList[0]));
                // it.insertPos = 5
                // it.content.nativeType === 2
                // this.adList.push(it);
                let adArr = [];
                // 广告位置重复过滤
                let adObj = {};
                for(let i in adsList){
                  const item = adsList[i]
                  if(!adObj[item.insertPos]){
                    adObj[item.insertPos] = true;// 当前位置有广告
                    adArr.push(item);
                  }
                  adArr[i].spaceId = res.space.spaceId
                }
                // adArr.sort((v1,v2)=>v2.insertPos-v1.insertPos);// 根据广告插入位置降序

                for(let item of adArr){// 在推荐列表中插入广告数据
                  if(item.insertPos <= clockInDetailList.length){
                    clockInDetailList.splice(item.insertPos-1, 0, item);
                  }
                }
                // 处理完广告数据：clockInDetailList
              }

            }else{
              this.statisticEvent(1015, startTime, '3'); ; // 报数 - 协商无结果
            }
          }
          return clockInDetailList
        })
        .catch(err=>{
          this.statisticEvent(1015, startTime, '4'); ; // 报数 - 协商无结果
          return err
        })
    },
    toBack(){
      // 1隐藏 0显示
      if(isIos){
        if(this.titleType == 1){
          jsToClient('updateBarStatus', {
            type:'topBar',
            visible:false,
            hideSafeAreaLayout: false
          })
        }else{
          jsToClient('updateBarStatus', {
            type:'topBar',
            visible:true,
            hideSafeAreaLayout: false
          })
        }
      }

      jsToClient('jumpTo', {
        action: 'finishPageById',
        data: {
          "ids":["pagetheme"]
        }
      })
    },
    // 跳转到规则页
    toRule(){
      // 埋点
      onStatisticEvent(2, {
        event_id: 'towntalk_rule_click',
        parm: this.topicId
      })
      setTimeout(() => {
        if(namespace){
          if(isIos){
            jsToClient('updateBarStatus', {
              type:'topBar',
              visible:true,
              hideSafeAreaLayout: false
            })
          }

          jsToClient('jumpTo', {
            action: 'html',
            data: {
              url: `${BASE_URL}/baby-task/clockin/clockin-rule?imgUrl=` + encodeURIComponent(this.imgUrl)
            }
          })
      }else{
        this.$router.push({
          path: '/clockin/clockin-rule?imgUrl=' + encodeURIComponent(this.imgUrl)
        })
      }
    }, 200)
    },
    // 跳转到中奖结果页
    toWinner(){
      if(!this.topicTask.rewardCover) {
        return
      }
      if(this.isEnableImmersion){
        if(namespace){
          if(isIos){
            jsToClient('updateBarStatus', {
              type:'topBar',
              visible:true,
              hideSafeAreaLayout: false
            })
          }

          jsToClient('jumpTo', {
            action: 'html',
            data: {
              url: `${BASE_URL}/baby-task/clockin/clockin-winners?imgUrl=` + encodeURIComponent(this.topicTask.rewardCover)
            }
          })
        }else{
          this.$router.push({
            path: '/clockin/clockin-winners?imgUrl=' + encodeURIComponent(this.topicTask.rewardCover)
          })
        }
      }else{
        Toast('只有新版本才能查看当前内容')
      }

    },
    // 跳转到对应页面
    toItemPage(data,num){
      if (data.advertId){ // 广告
        data.coordinateBean = {
          "upX": 99.609375,
            "upY": 96.703125,
            "downX": 99.609375,
            "downY": 96.703125,
            "upScreenY": 484,
            "upScreenX": 114,
            "downScreenY": 484,
            "downScreenX": 114,
            "offsetHeight": 46
        }
        gotoAdvert(data)
      } else {
        this.toVideo(data, num) // 内容 - // 跳转到视频页
      }
    },
    // 跳转到视频页
    toVideo(data,num){
      if(namespace){
        if(!this.isEnableImmersion){
          Toast('只有新版本才能查看当前内容')
          return false
        }
        // 埋点
        onStatisticEvent(2, {
          event_id: 'towntalk_video_click',
          obj_id: data.progressDetailId + '_' + data.topicId
        })
        // 活动已结束
        if(this.topicTask.status == 2){
          this.todayAttendance = true
        }
        // 跳转到视频播放页
        let dataObject = {
          topicId: data.topicId,
          progressDetailId: data.progressDetailId,
          isFromTopicList: true,
          isPunchCard: this.todayAttendance,
          pageNo: data.pageNo
        }
        if (this.indexVal){
          dataObject.targetStudentId = data.studentInfo.studentId
        }
        jsToClient('jumpTo',{
          action: 'gotoPunchCardShortVideoPlayPage',
          data: dataObject,
        }).then((res) => {
            if (res === 'YES') {
              location.reload() // 删除重新加载页面
            }
        })

      }else{  //端外推荐列表点击进去不需要传targetStudentId
        this.$router.push({
          path: '/clockin/clockin-video?progressDetailId=' + data.progressDetailId + '&topicId=' + data.topicId + '&childId=' + this.childId + '&classId=' + this.classId + '&schoolId=' + this.schoolId + '&studentId=' + this.studentId + '&version=' + this.version + '&activeIndex=' + num
        })
      }
    },
    //
    changeTab(index){
      // console.log(index)
      this.isactive = index
      this.indexVal = index
      this.page = 1
      this.loading = true
      this.finished = false
      this.isnone = false
      this.themeData = []
      if(this.loading){
        this.onLoad()
      }
    },
    async onLoad () {
      const listRes = await this.getClockInDetailList(this.indexVal) // 获取列表数据（含分页）
      if(this.studentId!=''){
        listRes.result.map(item => {item.pageNo = listRes.pageNo}) //保存视频在第几页
        console.log(listRes)
        if (this.isactive == 0) { // 热门推荐
          // 写死测试数据
          // this.themeData.unshift({"advertId":100932,"orderId":112,"platform":1,"insertPos":1,"isShowAdvert":1,"isInPay":false,"backAdvertIdLst":[],"materialType":4,"playtime":0,"content":{"title":"","subTitle":"","content":"这是广告的主标题，位置3","images":["http://ztjy-img-dev.szytest.com/ztnew/ad/img/2020/12/01/1606817173726750.jpg"],"adName":"这是广告主名称","icon":["http://ztjy-img-dev.szytest.com/ztnew/ad/img/2020/12/01/1606817163449934.png"],"width":750,"height":562,"nativeType":5},"sourceLogo":"","sourceMark":"掌通家园","interact":{"action":1,"openMode":0,"landPage":"{\"type\":\"2\",\"args\":{\"url\":\"https:\\/\\/kids.youdao.com\\/wx\\/index.html#\\/landing?sign=6FeltQ7lWy&outVender=zhangtong\",\"openType\":\"0\"}}","thirdInteract":{"view":["http://10.1.31.179:8083/ad/show?v=1&content=%2F4LGvYaWEtiKWOfkAiYTkzXOvCQgHw5hBOneDo3RaApHlbQX4d0kB6D%2BnyaLVZBqTUOtTIVPkDN6NUP6mazYSrPgXeLoB2xhaq6chG%2B6i7JzqjgoowzmmdC2iEffpgGls%2F2NL8TdrlLQqIH6ajQBQ2bhi6cP171pxqKSpiCJEAqS9ussqRcmkU5iqrKc9U0g"],"click":["http://10.1.31.179:8083/ad/click?v=1&content=%2F4LGvYaWEtiKWOfkAiYTkzXOvCQgHw5hBOneDo3RaApHlbQX4d0kB6D%2BnyaLVZBqTUOtTIVPkDN6NUP6mazYSrPgXeLoB2xhaq6chG%2B6i7JzqjgoowzmmdC2iEffpgGlkqyjQQ88xq4EWlo0AFtGvg%3D%3D"]}},"spaceId":1015,"listAnAdIndex":0})
          this.getAdData(listRes.result) // 获取广告数据
            .then(listAndAd => { // 合并广告后的列表数据
              this.themeData = this.themeData.concat(listAndAd)
            })
            .catch(err => {
              this.themeData = this.themeData.concat(listRes.result)
            })
            .finally(() => {
              this.handleEnd(listRes)
            })
        } else {
          this.themeData = this.themeData.concat(listRes.result)
          this.handleEnd(listRes)
        }
      } else {
        this.themeData = this.themeData.concat(listRes.result)
        this.handleEnd(listRes)
      }


    },
    handleEnd (listRes) { // 处理数据加载完后的状态
      if(listRes.result){
        this.loading = false
        Toast.clear()
        if(this.themeData.length>0){
          this.isnone = false
          if(!listRes.hasNext){
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
    },
    // 去打卡
    toClickIn(){
      // 事件埋点
      onStatisticEvent(2, {
        event_id: 'towntalk_clock_in_click',
        obj_id: this.topicId
      })
      if(this.isEnableImmersion){
        setTimeout(()=>{
          jsToClient('jumpTo',{
            action: 'publishChildSignCard',
            data: {
              topicId: this.topicId,
              topicName: '#' + this.topicName + '#'
            }
          })
        },300)
      }else{
        Toast('只有新版本才能进行当前操作')
      }

    },
    // 去邀请
    toInvitation(val){
      if(!this.isEnableImmersion){
        Toast('只有新版本才能进行当前操作')
        return false
      }
      let valText = '',isImShare = '',weixTitle = '',weixUrl = '',messageObj=''
      const picUrl = this.topicTask.picture
      if(namespace == 'parent'){
        weixTitle = '【'+this.studentName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'

        weixUrl = DOCUMENT_URL + '/baby-task/clockin/clockin-video?topicId=' + this.topicId + '&studentId=' + this.studentId + '&childId=' + this.childId + '&classId=' + this.classId + '&schoolId=' + this.schoolId + '&version=' + this.version + '&targetStudentId=' + this.studentId +'&progressDetailId=' + this.progressDetailId + '&studentName=' + encodeURIComponent(this.studentName) + '&isparent=1'

        this.teacherName = ''
        const topicId = this.topicId
        const targetStudentId = this.studentId
        const progressDetailId = this.progressDetailId
        if(this.groupId&&this.ispermissions){
          isImShare = 'TextOrShareLinkInfoImShare'
        }else{
          isImShare = ''
        }
        messageObj = {
          messageType: 2,
          text: '',
          title: weixTitle,
          content: weixContent,
          pic: picUrl,
          url: weixUrl,
          ext: {
            topicId: topicId,
            targetStudentId: targetStudentId,
            progressDetailId: progressDetailId
          }
        }
      }else if(namespace == 'gardener') {
        weixTitle = '【'+this.teacherName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'

        weixUrl = DOCUMENT_URL + '/baby-task/clockin/clockin-theme?topicId=' + this.topicId + '&studentId=' + this.studentId + '&childId=' + this.childId + '&classId=' + this.classId + '&schoolId=' + this.schoolId + '&version=' + this.version + '&targetStudentId=' + this.targetStudentId + '&teacherName=' + encodeURIComponent(this.teacherName)

        this.studentName = ''
        if(this.ispermissions){
          isImShare = 'imShare'
        }else{
          isImShare = ''
        }
        messageObj = {
          messageType: 1,
          text: '',
          title: weixTitle,
          content: weixContent,
          pic: picUrl,
          url: weixUrl
        }
      }
      if(val==0){  //当日已打卡，去邀请
        valText = 'towntalk_like_click'
      }else if(val==1){  //任务完成，去邀请
        valText = 'towntalk_give_like_click'
      }
      console.log(weixUrl,'weixUrl')
      // const weixTitle = '【'+this.studentName+'】正在挑战#'+this.topicTask.title+'#'

      // 事件埋点
      onStatisticEvent(2, {
        event_id: valText,
        obj_id: this.topicId
      })
      // 唤起分享协议
      jsToClient('share', {
				title: weixTitle,
				content: weixContent,
				url: weixUrl,
				pic: picUrl,
				sharePlatform: [
          {
					  'platformName': 'weChat' // 微信好友
          },
          {
					  'platformName': 'friendsCircle' // 微信朋友圈
          },
          {
            'platformName': isImShare,  //班级群
            'platformText': '班级群',
            'platformExtData': {
              'groupIds': this.groupId,
              'messages': [
                messageObj
              ]
            }
          }
        ]
      }).then(data=>{
        if(data=='share_im_suc'){  //班级群
          if(isIos){
            jsToClient('updateBarStatus', {
              type: 'topBar',
              visible: true,
              hideSafeAreaLayout: false
            })
          }
        }
      })

    },
    // 获取自己详情
    getUserClockInDetail(){
      if(namespace){
        this.getDocument()
      }
      let params = {
        topicId: this.topicId,
        studentId: this.studentId,
        userId: this.userId
      }
      $service.getUserClockInDetail(params).then(res => {
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          // Toast.clear()
          if(res&&JSON.stringify(res) !== '{}'){
            if (res.classmateList) {
              this.classmateList = res.classmateList
              if (res.classmateList.length) {
                this.classmateList.map((item, index) => {
                    if (index < 3) {
                        this.classStudent += item.trueName + ','
                    }
                })
              }
              if (this.classStudent) {
                  this.classStudent = this.classStudent.substr(0, this.classStudent.length - 1)
                  if (this.classmateList.length >= 3) {
                      this.classStudent = this.classStudent + '等'
                  }
              }
            }
            this.todayAttendance = res.todayAttendance
            this.istodayAttendance = !res.todayAttendance
            this.totalDay = res.totalDay
            if(res.topicTaskProgress&&JSON.stringify(res.topicTaskProgress) !== '{}'){
              this.topicTaskProgress = res.topicTaskProgress
              this.finishStatus = res.topicTaskProgress.finishStatus
            }
            // 班级群id
            if(res.classGroupId && res.classGroupId != ''){
              this.groupId = res.classGroupId
            }else{
              this.groupId = '@1'
            }
            let nowDate = new Date()
            this.nowDateTime = nowDate.getDate()
            if(localStorage.getItem('nowTime')){
              if(localStorage.getItem('nowTime')==nowDate.getDate()){
                this.istanc = false
              }else{
                // 当日未打卡
                if(!res.todayAttendance){
                  this.istanc = true
                }
                setTimeout(()=>{
                  localStorage.removeItem('nowTime')
                },400)
                setTimeout(()=>{
                  this.istanc = false
                },6000)
              }
            }else{
              localStorage.setItem('nowTime',this.nowDateTime)
              // 当日未打卡
              if(!res.todayAttendance){
                this.istanc = true
              }
              setTimeout(()=>{
                this.istanc = false
              },5000)
            }
            // 是否有勋章
            this.isMedalFlag = res.medal ? 1 : 0
            this.medal = res.medal
          }
        }
      })
    },
    // 获取作品详情
    getClockInDetail(indexVal){
      let sourceType = 0  //0家长端 1园丁端 2端外
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      if(this.namespace){
        if(namespace == 'gardener'){
          sourceType = 1
        }
      }else{
        sourceType = 2
      }
      let params = {
        topicId: this.topicId,
        studentId: this.targetStudentId,  //打卡任务归属学生ID，非当前浏览学生ID
        source: sourceType,
        userId: this.userId
      }
      $service.getClockInDetail(params).then(res => {
        console.log(res)
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
          if(res&&JSON.stringify(res) !== '{}'){
            if(res.topicTask&&JSON.stringify(res.topicTask) !== '{}'){
              this.topicTask = res.topicTask
              this.topicName = res.topicTask.title
              this.topicTaskStatus = res.topicTask.status
              if(!res.topicTask.rules || res.topicTask.rules == 'null' || res.topicTask.rules == ''){
                this.topicRules = false
              }else{
                this.topicRules = true
                this.imgUrl = res.topicTask.rules
              }
              if(res.topicTask.status==2&&res.topicTask.isReward){
                this.statusType = 'status_2'
              }
              if(res.topicTask.picture){
                localStorage.setItem('picture',res.topicTask.picture)
              }
              if(res.topicTask.topicType == 0 || res.topicTask.topicType == 1){
                this.topicType = res.topicTask.topicType
                if(res.topicTask.topicType == 0){  //家长自行参与
                  this.tuijText = '热门推荐'
                  this.topicTypeNum = 5
                }else if(res.topicTask.topicType == 1){  //老师发布进来
                  this.tuijText = '班级推荐'
                  this.topicTypeNum = 4
                }
                // 页面埋点
                // onStatisticEvent(1, {page_category: 3, page: 'sch_homework', page_id: this.topicId, parm:this.topicTypeNum})
              }
              this.themeStatus = this.topicTask.status // 活动状态
              this.joinStatus = this.topicTaskContent.joinStatus // 主题参与状态：1，已参与；0，未参与

            }else{
              this.noneTopicTask = true
            }

            if(res.topicTaskContent&&JSON.stringify(res.topicTaskContent) !== '{}'){
              this.topicTaskContent = res.topicTaskContent
              // this.progressDetailId = res.topicTaskContent.progressDetailId
            }else{
              this.topicTaskContentType = true
            }

            if(res.topicTaskStudentStatistics&&res.topicTaskStudentStatistics.length>0){
              this.topicTaskStudentStatistics = res.topicTaskStudentStatistics
            }

            if(res.currentStudentInfo && JSON.stringify(res.currentStudentInfo) !== '{}'){
              this.studentName = res.currentStudentInfo.trueName
            }

            if(res.range){
              this.range = res.range
            }

            this.getDocument()
            // 页面埋点namespaceType 1家长端，2园丁端
            onStatisticEvent(1, {page_category: 3, page: 'towntalk', page_id: this.topicId, parm:this.namespaceType})
          }else{
            this.noneTopicTask = true
          }
        }
      })
    },
    // 获取当前学生最新一条信息
    getStudentInfo(){
      let params = {
          topicId: this.topicId,
          page: 1,
          size: 20,
          studentId: this.targetStudentId,
          queryFrom: 1,
          userId: this.userId
      }
      $service.getClockInDetailList(params).then(res => {
        console.log(res)
        if(res.result&&res.result.length>0){
          this.progressDetailId = res.result[0].progressDetailId
        }
      })
    },
    // 获取作品列表
    getClockInDetailList(indexVal){
      if(this.loading === false){
        return new Promise(()=>{})
      }
      let params = {
          topicId: this.topicId,
          page: this.page,
          size: this.pageSize,
          userId: this.userId
      }
      // if(this.page==1){
      //   Toast.loading({
      //     message: '加载中...',
      //     forbidClick: true,
      //     loadingType: 'spinner',
      //     duration:0
      //   })
      // }
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      if(indexVal==0){
        params.studentId = this.namespace == 'parent' ? this.studentId : '',
        params.queryFrom = 0
      }else if(indexVal==1){
        params.studentId = this.targetStudentId,
        params.queryFrom = 1
      }
      this.page++
      return $service.getClockInDetailList(params)
        .finally(()=>{
          console.log('xxx')
          // Toast.clear()
        })
    },
    urlParamsDelete (name) {
			var loca = window.location
			var baseUrl = loca.origin + loca.pathname + '?'
			var query = loca.search.substr(1)
			if (query.indexOf(name) > -1) {
				var obj = {}
				var arr = query.split('&')
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].split('=')
					obj[arr[i][0]] = arr[i][1]
				}
				delete obj[name]
				var url = baseUrl + JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')
				return url
			}
		},
    // 微信分享信息
    getWeixInfo(){
      let weixTitle = ''
      let that = this
      if(this.studentName&&this.studentName!=''){
        weixTitle = '【'+this.studentName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'
      }
      if(this.teacherName&&this.teacherName!=''){
        weixTitle = '【'+this.teacherName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'
      }
      const picUrl = this.topicTask.picture
      window.wx.ready(function () {  //需在用户可能点击分享按钮前就先调用
        const data = {
          title: weixTitle, // 分享标题
          desc: weixContent, // 分享描述
          link: that.currentUrl.indexOf('code') > -1 ? that.urlParamsDelete('code') : window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: picUrl, // 分享图标
          success () {
          },
          cancel (e) {
          }
        }
        window.wx.onMenuShareAppMessage(data)
        window.wx.onMenuShareTimeline(data)
      })
    },
    //
    srollFun (data) {
      if(namespace){
        if(data.isFixed){
          jsToClient('updateBarStatus', {
            type:'topBar',
            visible: false,
            hideSafeAreaLayout: false
          })
          this.srollActive = true
        }else{
          this.srollActive = false
          jsToClient('updateBarStatus', {
            type:'topBar',
            visible: false,
            hideSafeAreaLayout: true
          })
        }
      }
    },
    // 获取文案
    getDocument () {
      const params = {
        'schoolId':'',
				'positionKeys': 'QZDK-A001,QZDK-A002,QZDK-A003,QZDK-A015,QZDK-A011,QZDK-A012'
			}
      $service.getDocument(params).then(res => {
        console.log(res)
        if(namespace == 'gardener'){
          this.tancText = res['QZDK-A015']
          weixTitleT = res['QZDK-A011']
          weixContent = res['QZDK-A012']
        }else{
          this.tancText = res['QZDK-A001']
          weixTitleT = res['QZDK-A002']
          weixContent = res['QZDK-A003']
        }

        if (this.$appEnv === 'wechat'){
          this.getWeixInfo()
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.clockin-theme{
  font-size: 28px;
  .tab-content{
    background: #fff;
    height: 85px;
    line-height: 85px;
    font-size: 30px;
    color: #1C1C1C;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 0 100px;
    .tab-btn{
      width: 50%;
      // margin: 0 60px;
    }
    .tab-btn.active{
      font-size: 32px;
      font-weight: bold;
    }
    .content1{
      text-align: right;
      margin-right: 60px;
    }
    .content1.iscenter{
      text-align: center;
      margin-right: 0;
    }
    .content2{
      text-align: left;
      margin-left: 60px;
    }
    .ct{
      display: inline-block;
    }
    .tab-btn.active .ct{
      background: url("../../assets/images/qinzi/icon_line.png") no-repeat center 45px;
      background-size: 76px;
    }

  }
  .studentName{
    display: inline-block;
    max-width: 170px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: top;
  }
  .theme-rule{
		position: absolute;
		right: 0;
		top: 80px;
		width: 118px;
		height: 40px;
		font-size: 24px;
		color: #1C1C1C;
		text-align: center;
		line-height: 44px;
		background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
		border-radius: 20px 0 0 20px;
		z-index: 6;
  }
  .theme-top{
		padding: 137px 24px 0;
		height: 400px;
		box-sizing: border-box;
    // background: rgba(0,0,0,0.40);
		color: #fff;
		font-size: 24px;
		line-height: 36px;
		color: #fff;
    position: relative;
    z-index: 3;
    overflow: hidden;
		// position: fixed;
		// left: 0;
		// top: 0;
		// right: 0;
    .top-beijImg{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      height: 400px;
      z-index: 1;
      img{
        width: 100%;
        // height: 100%;
      }
    }
    .top-beij{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
    .top-title{
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: row;
      align-items: center;
      .text{
        font-size: 40px;
        line-height: 56px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: bold;
        // flex: 1;
      }
      .unreward {
        background-image: linear-gradient(143deg, #E4E4E4 0%, #C6C6C6 96%);
        border-radius: 20px;
        font-size: 24px;
        color: #1C1C1C;
        width: 102px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        flex-direction: row;
      }
      .reward{
        background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
        border-radius: 20px;
        font-size: 24px;
        color: #1C1C1C;
        width: 174px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        flex-direction: row;
      }
    }
    .top-text{
      margin: 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-align: justify;
      position: relative;
      z-index: 3;
      word-break:break-all;
    }
    .top-dom{
      opacity: 0.6;
      .num{
        padding-left: 20px;
      }
      position: relative;
      z-index: 3;
    }
    .class-student{
        opacity: 0.6;
        margin-top: 10px;
        position: relative;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-align: justify;
        position: relative;
        z-index: 3;
        word-break:break-all;
    }
  }
  .theme-myContent{
		// position: fixed;
		width: 100%;
		background: #fff;
		// left: 0;
		// top: 400px;
		// height: 120px;
    z-index: 3;
    margin-bottom: 10px;
    .theme-my{
      width: 93.6%;
      height: 70px;
      box-sizing: border-box;
      background: url("../../assets/images/qinzi/bg_clock.png") no-repeat center;
      background-size: cover;
      overflow: hidden;
      line-height: 70px;
      font-size: 28px;
      margin: 16px auto 0;
      .my-img{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        margin:3px 12px 0 3px;
        float: left;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .my-text{
        overflow: hidden;
        display: flex;
        display: -webkit-flex;
        // align-items: center;
        color: #1C1C1C;
      }
    }
    #theme-end{
      background: url("../../assets/images/qinzi/bg_prize.png") no-repeat center;
      background-size: cover;
      .my-text{
        justify-content: center;
        color: #FF504D;
        display: flex;
        align-items: center;
      }
      .icon{
        display: block;
        background: url("../../assets/images/qinzi/icon_enter_red.png") no-repeat center;
        background-size: 100%;
        width: 9px;
        height: 14px;
        margin-left: 8px;
      }
    }
  }
  //
  .theme-tab{
    // padding-top: 580px;
    /deep/ .van-tabs--line .van-tabs__wrap{
      // position: fixed;
      // left: 0;
      // right: 0;
      // top: 510px;
      z-index: 12;
      background: #fff;
      // height: 110px;
    }
    /deep/ .van-tab{
      font-size: 32px;
      color: #BBBBBD;
      font-weight: bold;
      height: 100%;
    }
    /deep/ .van-tabs__nav--line{
      padding-bottom: 0;
    }
    /deep/ .van-tab--active{
      color: #FFA800;
      font-size: 34px;
    }
    /deep/ .van-tabs__line{
      width: 33px;
      height: 13px;
      background: url("../../assets/images/qinzi/icon_active.png") no-repeat center;
      background-size: 33px;
      bottom: 4px;
    }
  }
  //
  .theme-clockIn{
		width: 100%;
		position: fixed;
		bottom: 80px;
		display: flex;
		display: -webkit-flex;
		align-items: center;
    justify-content: center;
    .clockIn-content{
      height: 88px;
      line-height: 88px;
      text-align: center;
      padding: 0 50px;
      border-radius: 88px;
      font-size: 32px;
      box-shadow: 0 8px 24px 0 rgba(28,28,28,0.20);
      font-weight: bold;
    }
    .clockIn-in{
      background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
      color: #1C1C1C;
    }
    .clockIn-end{
      background: #eee;
      color: #BBBBBD;
    }
  }
  .theme-tanc{
    width: 406px;
    height: 255px;
    background: url("../../assets/images/qinzi/tc_guide.png") no-repeat center;
    background-size: 100%;
    box-sizing: border-box;
    padding:57px 162px 100px 75px;
    font-size: 26px;
    color: #fff;
    line-height: 34px;
    position: fixed;
    left: 50%;
    bottom: 158px;
    margin-left: -203px;
    z-index: 2;
    text-align: justify;
    .theme-tanc-text{
      font-weight: bold;
      text-shadow: 0 2px 8px #FFAF00;
    }
  }
  //
  .theme-content{
		overflow: hidden;
    // min-height: 950px;
    img{
      max-width: 100%;
    }
    .tablist-lf{
      float: left;
      margin-left: 20px;
    }
    .tablist-lr{
      float: right;
      margin-right: 20px;
    }
    .tablist-lt{
      width: 46%;
      overflow: hidden;
      .tab-lt{
        margin-top: 20px;
        .imt{
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          line-height: 0;
          .icon-video{
            width: 32px;
            height: 32px;
            background: url("../../assets/images/qinzi/icon_sp.png") no-repeat left bottom;
            background-size: 100%;
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
        .text{
          font-size: 28px;
          color: #1C1C1C;
          line-height: 40px;
          margin: 16px 0 10px;
          text-align: justify;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: bold;
        }
        .dom{
          display: flex;
          display: -webkit-flex;
          align-items: center;
          justify-content: space-between;
          font-size: 24px;
          line-height: 33px;
          .dom-imt{
            display: flex;
            display: -webkit-flex;
            align-items: center;
            color: #666666;
            overflow: hidden;
            img{
              width: 32px;
              height: 32px;
              overflow: hidden;
              border-radius: 50%;
              margin-right: 8px;
            }
          }
          .dom-dz{
            background:url("../../assets/images/qinzi/icon_support.png") no-repeat left center;
            background-size: 36px;
            padding-left: 36px;
          }
          .dom-dz.on{
            background:url("../../assets/images/qinzi/icon_support.gif") no-repeat left center;
            background-size: 36px;
          }
        }
      }
    }
	}
  //
  .pageNone{
    margin-top: 80px;
  }
  /deep/ {
    .theme-title{
      z-index: 105;
      top: 45px;
      .task-back{
        width: 48px;
        height: 48px;
        background: url("../../assets/images/qinzi/icon_back_white.png") no-repeat center;
        background-size: 100%;
      }
    }
  }
  /deep/ {
    .theme-title.active{
      top: 0;
    }
  }
  /deep/ .van-icon{
    font-size: 50px;
    color: #fff;
  }
  /deep/ {
    .theme-title.active .task-back{
      width: 48px;
      height: 48px;
      background: url("../../assets/images/qinzi/icon_back_black.png") no-repeat center;
      background-size: 100%;
    }
  }
}
#noneTopicTask{
  margin-top: 300px;
}
/deep/ .tuijNone .van-list__finished-text{
  display: none;
}
</style>
