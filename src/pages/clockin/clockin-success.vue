<template>
  <div class="successContent">
    <clockInTitle @toBack='toBack'></clockInTitle>
    <div class="success-title">{{documentTitle}}</div>
    <div class="clockin-end" v-if="topicTask.finishStatus==1">
      <div class="end-content">
        <div class="title">达成新成就</div>
        <div class="user">
          <div class="user-imt"><img :src="userMedalStatistics.medalIcon" /></div>
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
    <div class="clockin-success" v-if="topicTask.finishStatus==0">
      <div class="success-my">
        <template v-if="studentInfo.userPic">
          <img :src="studentInfo.userPic" />
        </template>
        <template v-else>
          <img v-if="studentInfo.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
          <img v-if="studentInfo.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
        </template>
      </div>
      <div class="success-content">
        <div class="title">恭喜<span class="name">{{studentInfo.trueName}}</span>完成今日打卡</div>
        <div class="tis">#{{topicTask.title}}#</div>
        <div class="content">
          <div class="content-lt">
            <div class="lt-tis">已打卡</div>
            <div class="lt-day">{{topicTask.attendanceCount}}天</div>
          </div>
          <div class="content-lt">
            <div class="lt-tis">目标打卡</div>
            <div class="lt-day">{{topicTask.totalDay}}天</div>
          </div>
        </div>
        <!-- <clockInBtn @btnclick="btnInvitation"></clockInBtn> -->
        <div class="clockin-btn" v-if="namespace">
          <div class="btn-text" @click="btnInvitation">{{btnText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as $service from "@/services"
import { Toast } from 'vant'
import clockInTitle from './components/clockInTitle'
import clockInBtn from './components/clockInBtn'
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import { DOCUMENT_URL } from '@/config/constants'
import { WECHAT } from '@/config/wechat'
import { browserInfo } from '@/utils/_tool.js'
const BASE_URL = window.location.origin
const isIos = browserInfo().isIos
// 
let weixTitle = '',weixContent = '', weixTitleT = ''
export default {
  name: "clockInSuccess",
  components: { clockInBtn,clockInTitle },
  data() {
    return {
      studentInfo: {},
      topicTask: {},
      btnText: '',
      studentId: '',
      isshow: false,
      isnone: false,
      recommendTopicTasks: [],
      userMedalStatistics: {},
      isuserMedalStatistics: false,
      namespace: namespace,
      groupId: '@1',
      topicId: getUrlParam('topicId'),
      isfrom: getUrlParam('isfrom'),
      progressDetailId: getUrlParam('progressDetailId'),
      targetStudentId: getUrlParam('targetStudentId'),
      documentTitle: '',
      ispermissions: false,  //班级群id是否开启
      moduleIdNum: 'jz0020002',
      userId: '',
      currentUrl: window.location.href
    };
  },
  created() {
    if(namespace){
      if(namespace&&namespace == 'gardener'){
        this.moduleIdNum = 'yd0030002'
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
      // 
      getUserInfo(this.$store).then(userInfo => {
        this.studentId = userInfo.student_uid
        this.studentName = userInfo.babyTrueName.substr(0,5)
        this.childId = userInfo.baby_uid
        this.classId = userInfo.class_uid
        this.schoolId = userInfo.school_id
        this.version = userInfo.st.app_ver
        this.userId = userInfo.uid
        this.getClockInInfo()
        this.init()
      })
      // 
      jsToClient('updateBarStatus', { 
        type:'topBar',
        visible: false,
        hideSafeAreaLayout: true
      })
      // 禁用侧滑
      jsToClient('setNavigationControllerPullBackEnabled', {
        disablePullBack: true
      })
    }else{
      this.studentId = getUrlParam('studentId')
      this.childId = getUrlParam('childId')
      this.classId = getUrlParam('classId')
      this.schoolId = getUrlParam('schoolId')
      this.version = getUrlParam('version')
      this.studentName = getUrlParam('studentName').substr(0,5)
      this.getClockInInfo()
      // this.getWeixInfo()
    }
  },
  mounted () {
    
	},
  methods: {
    init(){
      let that = this
      // 标记页面
      jsToClient('jumpTo', {
        action: 'flagPageId',
        data: {
          "id": "pagetheme"
        }
      })
    },
    toBack(){
      let toUrl = ''
      if(this.isfrom&&this.isfrom==1){  //返回到我参与的
        if(isIos){
          jsToClient('updateBarStatus', {
            type:'topBar',
            visible: true,
            updateBarStatus: false
          })
        }
        jsToClient('jumpTo', {
          action: 'finish'
        })
        // toUrl = `${BASE_URL}/baby-task/clockin/clockin-partin`
      }else{    //跳转到主题页
        toUrl = `${BASE_URL}/baby-task/clockin/clockin-theme?topicId=` + this.topicId
      }
      // 关闭当前页面
      // jsToClient('jumpTo', {
      //   action: 'finish'
      // })
      // 跳转到对应页面
      jsToClient('jumpTo', {
        action: 'html',
        data: {
          url: toUrl,
          needResult: true
        }
      })
    },
    btnInvitation(){
      let isImShare = ''
      // 事件埋点
      onStatisticEvent(2, {
        event_id: 'clock_in_succeed_share_click',
        obj_id: this.topicId
      })
      if(this.groupId&&this.ispermissions){
        isImShare = 'TextOrShareLinkInfoImShare'
      }else{
        isImShare = ''
      }
      //
      const weixUrl = DOCUMENT_URL + '/baby-task/clockin/clockin-video?topicId=' + this.topicId + '&studentId=' + this.studentId + '&childId=' + this.childId + '&classId=' + this.classId + '&schoolId=' + this.schoolId + '&version=' + this.version + '&targetStudentId=' + this.studentId +'&progressDetailId=' + this.progressDetailId + '&studentName=' + encodeURIComponent(this.studentName)
      const weixTitle = '【'+this.studentName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'
      const picUrl = this.topicTask.picture
      const topicId = this.topicId
      const targetStudentId = this.studentId
      const progressDetailId = this.progressDetailId
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
                {
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
              ]
            }
          }
        ]
			}).then(data=>{
        if(data=='share_im_suc'){  //班级群
          onStatisticEvent(2, {
            event_id: 'clock_in_succeed_share_popup_click',
            obj_id: this.topicId,
            parm: 1
          })
        }else if(data=='share_weixin_suc'){   //微信好友
          onStatisticEvent(2, {
            event_id: 'clock_in_succeed_share_popup_click',
            obj_id: this.topicId,
            parm: 2
          })
        }else if(data=='share_friends_suc'){  //微信朋友圈
          onStatisticEvent(2, {
            event_id: 'clock_in_succeed_share_popup_click',
            obj_id: this.topicId,
            parm: 3
          })
        }
        setTimeout(()=>{
          jsToClient('jumpTo', {
            action: 'html',
            data: {
              url: `${BASE_URL}/baby-task/clockin/clockin-theme?topicId=` + this.topicId,
              needResult: true
            }
          })
        },1000)
      })
      // 
    },
    // 
    getClockInInfo () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      const params = {
        studentId: this.studentId,
        topicId: this.topicId,
        userId: this.userId
      }
      $service.getClockInInfo(params).then(res => {
        console.log(res)
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
          this.isshow = true
          // 获取学生信息
          if(res.studentInfo){
            this.studentInfo = res.studentInfo
          }
          // 获取主题
          if(res.topicTask){
            this.topicTask = res.topicTask
            if(res.topicTask.finishStatus==1){
              // document.title = '打卡完成'
              this.documentTitle = '打卡完成'
              // 完成页面埋点
              onStatisticEvent(1, {page_category: 4, page: 'clock_in_complete', page_id: this.topicId, parm: getUrlParam('from')})
            }else if(res.topicTask.finishStatus==0){
              // document.title = '打卡成功'
              this.documentTitle = '打卡成功'
              // 成功页面埋点
              onStatisticEvent(1, {page_category: 4, page: 'clock_in_succeed'})
            }
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
            this.isuserMedalStatistics = true
          }
          // 班级群id
          if(res.classGroupId && res.classGroupId != ''){
            this.groupId = res.classGroupId
          }else{
            this.groupId = '@1'
          }
          // 
          this.getDocument()
        }
      })
    },
    // 跳转到任务专题页
    toDetail(val){
      if(namespace){
          jsToClient('jumpTo', {
            action: 'html',
            data: {
              url: `${BASE_URL}/baby-task/clockin/clockin-theme?topicId=` + val.topicId
            }
          })
      }else{
        this.$router.push({
          path: '/clockin/clockin-theme?topicId=' + val.topicId + '&studentId=' + this.studentInfo.studentId + '&childId=' + this.studentInfo.childId + '&classId=' + this.studentInfo.classId + '&schoolId=' + this.studentInfo.schoolId + '&version=' + this.studentInfo.version + '&targetStudentId=' + this.studentInfo.studentId + '&studentName=' + this.studentInfo.trueName
        })
      }
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
      let that = this
      const picUrl = this.topicTask.picture
      const weixTitle = '【'+this.studentName.substr(0,5)+'】'+weixTitleT+'#'+this.topicTask.title+'#'
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
    // 获取文案
    getDocument () {
      const params = {
        'schoolId':'',
				'positionKeys': 'QZDK-A002,QZDK-A003,QZDK-A0020'
			}
      $service.getDocument(params).then(res => {
        console.log(res)
        this.btnText = res['QZDK-A0020']
        weixTitleT = res['QZDK-A002']
        weixContent = res['QZDK-A003']
        if(this.$appEnv === 'wechat'){
          // 获取微信二次分享信息
          this.getWeixInfo()
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.successContent{
  height: 100%;
  padding-top: 40px;
  .success-title{
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 36px;
    color: #1C1C1C;
    position: fixed;
    left: 0;
    top: 40px;
    right: 0;
    z-index: 9;
  }
  .theme-title{
    z-index: 105;
    top: 45px
  }
}
.clockin-success{
  font-size: 28px;
  padding-top: 165px;
  position: fixed;
  overflow: hidden;
  background: rgba(255,209,0,0.4);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .success-my{
    width: 410px;
    height: 172px;
    background: url("../../assets/images/qinzi/bg_avatar.png") no-repeat center;
    background-size: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    position: relative;
    z-index: 2;
    img{
      display: block;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      margin-top: -8px;
    }
  }
  .success-content{
    width: 670px;
    height: 938px;
    background: url("../../assets/images/qinzi/bg_success.png") no-repeat center;
    background-size: 100%;
    margin: -98px auto 0;
    color: #1C1C1C;
    .title{
      padding: 184px 0 10px;
      text-align: center;
      font-size: 36px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      .name{
        display: inline-block;
        max-width: 215px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .tis{
      text-align: center;
      font-size: 32px;
      line-height: 45px;
    }
    .content{
      display: flex;
      justify-content: space-between;
      padding: 80px 130px 180px 130px;
      box-sizing: border-box;
      .content-lt{
        text-align: center;
        .lt-tis{
          font-size: 24px;
          color: #818D9D;
          line-height: 33px;
          margin-bottom: 3px;
          font-weight: normal;
        }
        .lt-day{
          font-size: 56px;
          color: #FFD100;
          line-height: 78px;
        }
      }
    }
    .clockin-btn{
      height: 88px;
      line-height: 88px;
      border-radius: 44px;
      text-align: center;
      font-size: 32px;
      width: 590px;
      background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
      box-shadow: 0 4px 8px 0 rgba(255,209,0,0.40);
    }
  }
  .success-content>div{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 610px;
    margin: 0 auto;
    font-weight: bold;
  }
}
.clockin-end{
  font-size: 28px;
  padding-top: 155px;
  position: fixed;
  background: rgba(255,209,0,0.4);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .end-content{
    width: 706px;
    height: 1142px;
    background: url("../../assets/images/qinzi/bg_xz.png") no-repeat center;
    background-size: 100%;
    padding: 44px 41px 0;
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
        margin: 20px 0;
        min-height: 370px;
        img{
          max-width: 300px;
        }
      }
      .user-name{
        font-size: 32px;
        line-height: 45px;
        font-weight: bold;
        margin: 0 auto 16px;
        min-height: 45px;
      }
      .user-text{
        font-size: 24px;
        line-height: 36px;
      }
    }
    .tuij{
      margin-top: 110px;
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
            font-weight: bold;
          }
          .lt-tis{
            font-size: 24px;
            color: #818D9D;
            margin-top: 4px;
            .spn{
              color: #FFA800;
              padding-left: 10px;
              font-weight: bold;
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
