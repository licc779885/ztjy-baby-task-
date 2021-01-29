<template>
  <div class="clockin-video">
    <clockInTitle></clockInTitle>
    <van-swipe style="height: 200px;" vertical :show-indicators='false' @change="changeVideo" v-if="videoListArr.length>0" :loop="loopType">
      <van-swipe-item v-for="(item,index) in videoListArr" :key="index" :name="item.topicId">
        <video 
          :id="'video'+index" 
          :ref="'videoPlayer'+index" 
          class="video-js" 
          controls 
          x5-video-player-type='h5-page' 
          t7-video-player-type="inline" 
          playsinline="isiPhoneShowPlaysinline"  
          webkit-playsinline="isiPhoneShowPlaysinline" 
          x-webkit-airplay="" 
          preload="none" 
          :poster="item.cover"
          :src='item.video'>
        </video>
        <div class="video-name" v-if="item.title">#{{item.title}}#</div>
        <div class="video-clockIn">{{item.content}}</div>
        <!-- 提测添加v-if="isweix" -->
        <div class="video-dz" v-if="isweix">
          <div class="dz-btn">
            <img src="../../assets/images/qinzi/icon_sp_like.png" @click="btnPraise(item)" style="width: 50px;" v-if="isActive" />
            <img src="../../assets/images/qinzi/icon_support.gif" style="width: 50px;" v-else />
          </div>
          <div class="dz-num">{{item.praiseCount|numThousand}}</div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <!--  -->
    <div class="video-btn" v-if="!namespace">
      <div class="btn-text" @click="openApp">打开掌通家园继续助力</div>
      <div style="display:none" ref='down'></div>
    </div>
  </div>
</template>

<script>
import * as $service from "@/services"
import { Swipe, SwipeItem, Toast } from 'vant'
import { getUrlParam, versionCompare } from 'szyutils'
import clockInTitle from './components/clockInTitle'
import { WECHAT } from '@/config/wechat'
import { DOCUMENT_URL, ENV_PREFIX } from '@/config/constants'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
const BASE_URL = window.location.origin
let weixTitle = '',weixContent = '',weixTitleT = ''
export default {
  name: "clockInVideo",
  components: {
    clockInTitle
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
    }
  },
  data() {
    return {
      auto: false,
      isdz:true,
      isActive:true,
      isweix:false,
      page: 1,
      pageSize: 20,
      progressDetailId: getUrlParam('progressDetailId'),
      targetStudentId: getUrlParam('targetStudentId'),
      topicId: getUrlParam('topicId'),
      childId: getUrlParam('childId'),
      classId: getUrlParam('classId'),
      schoolId: getUrlParam('schoolId'),
      version: getUrlParam('version'),
      activeIndex: parseInt(getUrlParam('activeIndex')) || 0,
      activeNumKey: 0,
      isparent: parseInt(getUrlParam('isparent')),  //家长端主题页分享进来
      title: '',
      content:'',
      praiseCount: 0,  //点赞数
      videoFist: [],
      videoList: [],
      videoListArr: [],
      videoListCurrent: [],
      // page: 0,
      current: 0,
      loopType: false,
      coverUrl: '',
      namespace: namespace,
      tip: '',
      isopen: true,
      userInfo: JSON.parse(window.localStorage.getItem('wx_user_info')),
      totalData: 0,
      finalActiveNum:0,
      hasNext: false,
      currentUrl: window.location.href
    }
  },
  created() {
    this.getDocument()
    const ua = window.navigator.userAgent.toLowerCase()
    if (/micromessenger/.test(ua)) {
      console.log('我是微信环境')
      this.isweix=true
    }
    
    // this.getVideoList()
  },
  mounted () {
    // 
    window.szyDownload.init({
        downLoadInfo: {
          type: 'download_btn_radius',
          parentNode: this.$refs.down, // 传入父节点
          buttonText: '下载掌通家园',
          appType: 'parent' // teacher 代表需要下载园丁端渠道包，parent代表需要下载家长端渠道包，默认值是parent
        },
        clickListener: true
    })
    // 
	},
  methods: {
    toDownLoad(){
      console.log('toDownLoad')
    },
    // 点赞
    btnPraise(data){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      const params = {
        appType: 'wx',
        businessId: data.progressDetailId,
        childId: this.childId,
        classId: this.classId,
        schoolId: this.schoolId,
        studentId: this.studentId,
        actionType: 38,
        taskNumber: 'dwrw000001',
        appVersion: this.version,
        userId: this.userInfo.openid  //微信授权时有带上了
      }
      if(this.isdz && this.isopen){
        this.isdz=false  //防止频繁点击
        $service.continueLike(params).then(res => {
          console.log(res)
          if(res.code && res.code!=10000){
            console.log('数据错误')
            this.isdz = true
          }else{
            Toast.clear()
            if(res.status==0){
              Toast('点赞成功')
              this.isdz = false
              this.isActive = false
              this.isopen = true
              data.praiseCount += 1
              setTimeout(()=>{
                this.isdz = true
                this.isActive = true
              },1000)
            }else{
              Toast(res.tip)
              this.tip = res.tip
              this.isdz = true
              this.isopen = false
            }
            
          }
        }).catch(err=>{
          this.isdz = true
        })
      }else{
        this.isdz = true
        Toast(this.tip)
      }

    },
    openApp() {
      const reportData = {
        event_id: 'short_video_advance_click',
        obj_id: this.topicId
      }
      this.$szyreport.reportEvent({
        data: reportData,
        prefix: ENV_PREFIX
      })
      window.szyDownload.openApp()
    },
    // 获取视频信息
    getVideoInfo () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration:0
      })
      const params = {
        progressDetailId: this.progressDetailId
      }
      $service.getVideoInfo(params).then(res => {
        // console.log(res)
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
        }
        
        if(res.studentInfo){
          const studentName = res.studentInfo.trueName.substr(0,5)
          weixTitle = '【'+studentName+'】'+weixTitleT+'#'+res.title+'#'
        }

        // 
        this.videoFist.unshift(res)
        this.posterUrl = res.cover
        this.videoUrl = res.video
        this.videoListArr = this.videoFist
        this.videoListCurrent = this.videoListArr
        this.coverUrl = res.cover
        this.studentId = res.studentInfo.studentId
        this.getTuijVideoList()
        //无targetStudentId表示从推荐列表进来，调用推荐列表方法
        // if(this.targetStudentId && this.targetStudentId!=''){
        //   if(this.isparent == 1){
        //     this.videoFist = []
        //   }else{
        //     this.videoFist.unshift(res)
        //     this.posterUrl = res.cover
        //     this.videoUrl = res.video
        //     this.videoListArr = this.videoFist
        //     this.videoListCurrent = this.videoListArr
        //     this.coverUrl = res.cover
        //   }
        //   this.getVideoList()
        // }else{
        //   console.log(this.activeIndex,'this.activeIndex')
        //   console.log(this.pageSize,'page')
        //   let activeNum = Math.ceil(parseInt(this.activeIndex+1)/this.pageSize)
        //   console.log(activeNum,'activeNum')
        //   if(parseInt(this.activeIndex+1)<=this.pageSize){
        //     this.getTuijVideoList(0)
        //   }else{
        //     let proxyGetTuijVideoList=()=>{
        //       this.finalActiveNum+=1
        //        this.getTuijVideoList(0,()=>{
        //           if(this.finalActiveNum<activeNum){
        //             proxyGetTuijVideoList()
        //           } 
        //        })
        //     }
        //     proxyGetTuijVideoList()
        //   }
        // }

        if(this.$appEnv === 'wechat'){
          this.getWeixInfo()
        }
        
      })
    },
    // 获取学生视频列表
    getVideoList () {
      const params = {
        studentId:'',
        targetStudentId: this.targetStudentId,
        topicId: this.topicId
      }
      $service.getVideoList(params).then(res => {
        if(res.contentList&&res.contentList.length>0){
          this.videoList = res.contentList
          this.videoListArr = this.videoFist.concat(this.videoList)
          this.activeNumKey = this.activeIndex
        }
      })
    },
    // 获取推荐视频列表
    getTuijVideoList(){
      const params = {
          topicId: this.topicId,
          page: this.page,
          // size: this.pageSize,
          size: 100,
          studentId: this.studentId,
          queryFrom: 1,
          userId: this.userId
      }
      // this.page++
      $service.getClockInDetailList(params).then(res => {
        this.hasNext = res.hasNext
        console.log(params,'kkk')
        if(res.result&&res.result.length>0){
          this.videoList = res.result.filter(item => item.progressDetailId != this.progressDetailId)
          this.videoListArr = this.videoFist.concat(this.videoList)
        }
        // callback&& callback();
      })
      
    },
    // 上下切换视频
    changeVideo(index){
      console.log(index,'index')
      let video = document.querySelectorAll('video')[this.current]
      video.pause()
      this.current=index
      document.querySelectorAll('video')[index].load()
      setTimeout(()=>{
        document.querySelectorAll('video')[index].play()
      },300)
      // 推荐列表分页
      if(index==0){
        this.loopType = false
      }else{
        this.loopType = true
      }
      this.tip = ''
      this.isdz = true
      this.isopen = true
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
      let wxpicture = require('@/assets/images/qinzi/logo_weix.png')
      // if(localStorage.getItem('picture')){
      //   wxpicture =  localStorage.getItem('picture')
      // }
      wx.ready(function () {  //需在用户可能点击分享按钮前就先调用
        const data = {
          title: weixTitle, // 分享标题
          desc: weixContent, // 分享描述
          link: that.currentUrl.indexOf('code') > -1 ? that.urlParamsDelete('code') : window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: wxpicture, // 分享图标
          success () {
          },
          cancel (e) {
          }
        }
        wx.onMenuShareAppMessage(data)
        wx.onMenuShareTimeline(data)
      });
    },
    // 获取文案
    getDocument () {
      const params = {
        'schoolId':'',
				'positionKeys': 'QZDK-A002,QZDK-A004'
			}
      $service.getDocument(params).then(res => {
        console.log(res)
        weixTitleT = res['QZDK-A002']
        weixContent = res['QZDK-A004']
        this.getVideoInfo()
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.clockin-video{
  font-size: 28px;
  height: 100%;
  /deep/ .van-swipe{
    height: 100% !important;
  }
  video{
    width: 100%;
    height: 100%;
    // position: fixed;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // top: 0;
    background: #000;
  }
  .task-title{
    height: 84px;
    line-height: 90px;
    padding: 0 16px;
    position: fixed;
    left: 0;
    top: 42px;
    right: 0;
    z-index: 5;
  }
  .task-title .van-icon{
    font-size: 48px;
    color: #fff;
  }
  .video-imt{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    img{
      width: 100%;
      // height: 100%;
    }
  }
  .video-name{
    position: absolute;
    left: 30px;
    bottom: 236px;
    right: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
    text-align: justify;
    font-size: 28px;
    z-index: 2;
  }
  .video-clockIn{
    position: absolute;
    left: 30px;
    right: 30px;
    bottom: 178px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
    text-align: justify;
    font-size: 32px;
    z-index: 2;
  }
  .video-btn{
    display: flex;
    display: -webkit-flex;
    position: fixed;
    left: 30px;
    right: 30px;
    bottom: 80px;
    align-items: center;
    justify-content: center;
    z-index: 2;
    overflow: hidden;
  }
  .video-btn .btn-text{
    width: 100%;
    height: 88px;
    line-height: 88px;
    color: #1C1C1C;
    font-size: 32px;
    background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
    border-radius: 44px;
    text-align: center;
  }
  .video-dz{
    width: 100px;
    position: absolute;
    z-index: 2;
    right: 20px;
    bottom: 30%;
    text-align: center;
    color: #fff;
    font-size: 28px;
    z-index: 2;
  }
  .video-dz .dz-btn{
    width: 100px;
    height: 100px;
  }
  .video-dz .dz-num{
    margin-top: -16px;
  }
}
</style>
