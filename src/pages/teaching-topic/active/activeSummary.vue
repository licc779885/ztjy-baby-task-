<template>
    <div class="contain" :style="pageInfo.style ? 'background:'+ pageInfo.style : '#FFC1A0'">
        <!-- <div v-if="isActive"> -->
            <img class="contain-top" :src="pageInfo.picture? pageInfo.picture : defaultImg" alt="">
            <div class="contain-btm">
                <active-theme :activeTxt='pageInfo.schoolName ? pageInfo.schoolName : ""' :className='pageInfo.className'></active-theme>
                <div class="active-contant">
                    <div class="con-title"><i class="icon-left"></i><p>一起看宝贝们的成长足迹吧！</p><i class="icon-right"></i></div>
                    <div class="active-time">
                        <i class="icon-time"></i>
                        <div class="time-right">
                            <p>开课时间： {{pageInfo.startDate | formatDate}}</p>
                            <span>这天您选择开课啦~</span>
                        </div>
                    </div>
                    <course-task v-if="courseInfo != undefined"  :courseTaskInfo='courseInfo' :moreFlag='moreCourseFlag' @change='moreCourseFlag = !moreCourseFlag'></course-task>
                    <no-data v-else  txt='暂无课程'></no-data>
                    <div class="con-title course-progress"><i class="icon-left"></i><p>课程精彩瞬间</p><i class="icon-right"></i></div>
                    <div class="con-title course-progress-small task-project"><i class="icon-left-small"></i><p>不错过孩子的每一张笑脸</p><i class="icon-right-small"></i></div>
                    <div class="course-progress-content" v-if="growth != undefined">
                        <div class="box-text" :class="allFlag?'box-text-one':''" v-if="growth.text && growth.text.length">{{growth.text}}</div>
                        <div class="box-btn"  v-if="growth.text && growth.text.length" @click='allFlag = !allFlag'>{{allFlag?'全文': '收起'}}</div>
                        <div :key='index' v-for="(item, index) in growth.images" >
                            <img v-if="index < 10 || allPhotoFlag" :src="item.imageUrl" alt="">
                        </div>
                        <div class="all-photo" v-if='growth.images && growth.images.length>10 && !allPhotoFlag' @click="allPhotoFlag = true">查看全部{{growth.images.length}}张图 <i></i></div>
                        <video  v-if='growth.videos && growth.videos.length' :src="growth.videos[0].videoUrl" :poster='growth.videos[0].videoUrl+"?vframe/jpg/offset/0/rotate/auto"' controls  x5-video-player-type='h5-page' t7-video-player-type="inline" playsinline="isiPhoneShowPlaysinline"  webkit-playsinline="isiPhoneShowPlaysinline" x-webkit-airplay="" preload="none"></video>
                    </div>
                    <no-data v-else  txt='快去课程方案-上传动态'></no-data>
                    <div class="con-title task-progress"><i class="icon-left"></i><p>比礼物更珍贵的是一家人在一起的时光</p><i class="icon-right"></i></div>
                    <course-task v-if="growthTask != undefined" :courseTaskInfo='growthTask' :moreFlag='moreTaskFlag' @change='moreTaskFlag = !moreTaskFlag'></course-task>
                    <no-data v-else  txt='暂无亲子任务'></no-data>
                    <div class="con-title course-progress"><i class="icon-left"></i><p>最幸福的事是我们伴你成长</p><i class="icon-right"></i></div>
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        :finished-text="finishedTxt"
                        @load="onLoad"
                        >
                    <div v-if='list.length'>
                        <div v-for="(item, index) in list" :key='index'>
                            <div class="con-title course-progress-small task-project"><i class="icon-left-small"></i><p>第{{index + 1}}天 班级完成情况</p><i class="icon-right-small"></i></div>
                            <div class="task-progressed" v-if='item.images.length || item.videos.length'>
                                <img v-for="key in item.images" :key="key.taskId" :src="key.imageUrl" alt="">
                                <video v-for="key in item.videos" :key='key.taskId' :src="key.videoUrl" :poster='key.videoUrl+"?vframe/jpg/offset/0/rotate/auto"' controls  x5-video-player-type='h5-page' t7-video-player-type="inline" playsinline="isiPhoneShowPlaysinline"  webkit-playsinline="isiPhoneShowPlaysinline" x-webkit-airplay="" preload="none"></video>
                                <div v-if="!isWeiX" class="more-task" @click='moreTask(item)'>查看更多完成情况</div>
                            </div>
                            <no-data v-else txt='还没有人完成任务哦~'></no-data>
                        </div>
                    </div>
                    </van-list>
                    <div v-if='!list.length'>
                        <div class="con-title course-progress-small"><i class="icon-left-small"></i><p>班级完成情况</p><i class="icon-right-small"></i></div>
                        <no-data txt='还没有人完成任务哦~'></no-data>
                    </div>
                    <img class="end" src="../../../assets/images/teaching-topic/ending.png" alt="">
                    <!-- 学校简介 s -->
                    <div v-if="isWeiX" class="garden-info-wrapper" style="margin-top: 10px">
                        <div class="garden-info-inner">
                            <div class="garden-info-content">
                            <div class="garden-info-white">
                                <span class="garden-info-title">神州鹰管理群</span>
                                <p class="garden-info">神州鹰软件科技有限公司成立于2011年1月25日，旗下主要产品“掌通家园”于2014年正式上线，是一个专注于家园共育的互联网+教育管理平台。

                                    基于开放式的远程视频直播、便捷的校务管理、精确的安全签到系统以及丰富的育儿资源等服务，掌通家园为家长、园长、幼师和第三方幼教机构提供一个高效管理、实时互动和个性化学习的管理平台。
                                    
                                    截至目前，掌通家园覆盖全国近2100余个县区，服务2400万家长和100万幼师。掌通家园家长端日活近400万，月活1000万；园丁端日活40万，月活100万。在全球教育类app中，掌通家园幼师活跃度第一。
                                    
                                    在易观公布的5月全国APP1000榜单中，掌通家园家长端和园长端均进入前1000，在同类产品中，形成“双第一”地位，已成为国内领先的幼教管理平台。</p>
                                <a href="https://h5server.ztjy61.com/H5Server/service/getSchoolInfoPage.action?schoolId=GByyPPIpBxWgf5jhley&appType=teacher&userid=5448f940c184475b4b37&babyid=" class="more">查看官网<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAXCAYAAAA/ZK6/AAAAAXNSR0IArs4c6QAAAMpJREFUOBGVlEkKAjEQRTtewHnWC3gLDy14AAVFRVtwHvYuxQPEV1ILN5Jvwado+j1CupLOYowjMiGNTCmHaXFHmkkHqE62xGpPWopUA8zNoA6krUhVwI0Z1JHI0vqjxHiid5SVKoArly70riKVAZcuXek9RSoBLly60fuqNHfprkpFwJlL4+QqBgAPXHglBUB9BWDbuLYHh7WvBKzPAfh70meef0+al3YAtbPksHZagfX7APzfjUOwH4CVdKcLjPpJpmQYQnikRv8GoOlvI5lyWwsAAAAASUVORK5CYII="></a>
                            </div>
                            </div>
                        </div>
                    </div>
                    <!-- 学校简介 e -->
                </div>
            </div>
        <!-- </div> -->
        <!-- <no-active v-else></no-active> -->
    </div>
</template>
<script>
import { getSummary, taskSuccessList, getDocument } from '@/services'
import { getUrlParam } from 'szyutils'
import noData from './components/no-data'
import noActive from './components/no-active'
import activeTheme from './components/activeTheme'
import courseTask from './components/course-task'
import Vue from 'vue'
import { List } from 'vant'
import { Toast } from 'vant'
import { jsToClient, clientToJs, namespace } from '@/utils/client'
import { mapGetters } from "vuex";
const moment = require('moment');
Vue.use(List)
export default {
    name: 'activeSummary',
    components: {
        noData,
        activeTheme,
        courseTask,
        noActive
    },
    data () {
        return {
            moreCourseFlag: true,
            moreTaskFlag: true,
            pageInfo: {},
            courseInfo: {},
            growthTask: {},
            growth: {},
            allPhotoFlag: false,
            defaultImg: require('../../../assets/images/teaching-topic/bg.png'),
            pageNo: 1,
            pageSize: 5,
            list: [],
            loading: false,
            finished: false,
            documentTxt: {},
            finishedTxt: '',
            isWeiX: false,
            isActive: null,
            allFlag: true
        }
    },
    filters: {
        formatDate (value) {
            if (value) {
                return moment(value).format('MM.DD')
            }
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'global/userInfo',
            userId: 'global/userId'
        }),
    },
    mounted () {
        this.getSummary()
        this.$store.dispatch('global/getUserInfo').then(() => {
            console.log(this.userInfo.school_id)
            this.getDocument(this.userInfo.school_id)
        })
        this.openWX()
        this.pv({
            page: 'view_summary',
            page_category: 3,
            parm: getUrlParam('teachingActivityId')
        })
        this.isWeiX = namespace ? 0 : 1
    },
    methods: {
        searchMoreInfo (type) {
            type ? this.moreCourseFlag = !this.moreCourseFlag : this.moreTaskFlag = !this.moreTaskFlag
        },
        getDocument (schoolId) {
            getDocument({schoolId,positionKeys:'JNHD-A0014,JNHD-A0015'}).then(res => {
                this.documentTxt = res
            })
        },
        getSummary () {
            let param = {
                teachingActivitieJoinId: getUrlParam('teachingActivityJoinId')
            }
            getSummary(param).then(res => {
                
                if(res.code && res.code !== 10001) {
                    this.isActive = false
                    return
                }
                if(res.code && res.code !== 10000) {
                    Toast(res.message)
                    return
                }
                this.isActive = true
                this.pageInfo = res
                this.courseInfo = res.course
                this.growth = res.growth
                this.growthTask = res.growthTask
            })
        },
        taskSuccessList () {
            let param = {
                teachingActivitieJoinId: getUrlParam('teachingActivityJoinId'),
                page: this.pageNo,
                size: this.pageSize
            }
            this.pageNo++
            taskSuccessList(param).then(res => {
                if(res.code && res.code !== 10000) {
                    Toast(res.message)
                    return
                }
                if (res.result.length) {
                    this.list = this.list.concat(res.result)
                    // console.log(this.list)
                    this.loading = false
                    if(this.list.length>0){
                        if(this.list.length >= res.totalCount){
                            this.finished = true
                            this.finishedTxt = ''
                        }
                    }else{
                        this.finished = true
                        this.finishedTxt = ''
                    }
                } else {
                    this.finished = true
                    this.finishedTxt = ''
                }
            })
        },
        moreTask (item) {
            if (!namespace) {
                return
            }
            jsToClient('jumpTo', {
                action: 'homeTask',
                data: {
                    taskId: item.taskId,
                    classId: item.classId,
                    schoolId: item.schoolId
                }
            })
        },
        onLoad() {
            this.taskSuccessList()
        },
        openWX () {
            if (!namespace) {
                return
            }
            this.ev({
                event_id: 'click_summary_sharing',
                obj_id: getUrlParam('teachingActivityId')
            })
            jsToClient('jumpTo', {
                action: 'topbar',
                data: {
                    right_icon: 'http://zthome.ztjystore.cn/7800020120201124103559667XGAH65oJ',
                    clickAction: 'js',
                    js: namespace + '.openShare'
                }
            })
            clientToJs('openShare', () => {
                jsToClient('share', {
                    sharePlatform: [
                        {
                            platformName: 'weChat',
                            platformText: '微信好友'
                        }, {
                            platformName: 'friendsCircle',
                            platformText: '朋友圈'
                        }, {
                            platformName: 'imShare',
                            platformText: '班级群'
                        }
                    ],
                    title: this.documentTxt['JNHD-A0014'].replace(/「班级名称」/g, this.pageInfo.className),
                    url: window.domain + '/teaching-topic/active/summary?teachingActivityJoinId=' + getUrlParam('teachingActivityJoinId'),
                    pic: 'http://zthome.ztjystore.com/upload_a0f3ec9b_1479_4379_bc64_a26590373717_00028145.tmp',
                    content: this.documentTxt['JNHD-A0015']
                })
            })
        }
    }
}
</script>
<style lang='scss' scoped>
.contain{
    width: 100%;
    .contain-top{
        width: 100%;
        height: 400px;
        background-size: 100% 400px;
        display: block;
    }
    .contain-btm{
        margin: 0;
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        padding-bottom: 30px;
        .active-contant{
            background: #FFFFFF;
            box-shadow: 0 4px 10px 0 rgba(150,149,149,0.24);
            border-radius: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 690px;
            margin-top: 30px;
            padding-top: 50px;
            .con-title{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                i{
                    width: 74px;
                    height: 76px;
                }
                p{
                    font-size: 36px;
                    color: #1C1C1C;
                    line-height: 48px;
                    font-weight: 600;
                    max-width: 470px;
                    text-align: center;
                }
                .icon-left{
                    margin-left: 24px;
                    background: url('../../../assets/images/teaching-topic/icon-left.png');
                    background-size: 74px 76px;
                }
                .icon-right{
                    margin-right: 24px;
                    background: url('../../../assets/images/teaching-topic/icon-right.png');
                    background-size: 74px 76px;
                }
                .icon-left-small{
                    margin-left: 24px;
                    background: url('../../../assets/images/teaching-topic/icon-left-small.png') no-repeat;
                    background-size: 50px 30px;
                }
                .icon-right-small{
                    margin-right: 24px;
                    background: url('../../../assets/images/teaching-topic/icon-right-small.png') no-repeat;
                    background-size: 50px 30px;
                }
            }
            .active-time{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: 50px;
                height: 97px;
                .icon-time{
                    width: 76px;
                    height: 83px;
                    background: url('../../../assets/images/teaching-topic/icon-time.png');
                    background-size: 76px 83px;
                }
                .time-right{
                    margin-left: -18px;
                    width: 514px;
                    height: 97px;
                    background: rgba(0,170,255,0.08);
                    display: flex;
                    flex-direction: column;
                    border-radius: 20px;
                    padding-left: 58px;
                    p{
                        font-size: 36px;
                        color: #00AAFF;
                        font-weight: 500;
                    }
                    span{
                        font-size: 28px;
                        color: #333333;
                    }
                }
            }
            .course-progress{
                margin-top: 50px;
            }
            .course-progress-content{
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 30px;
                img{
                    width: 100%;
                    margin-bottom: 20px;
                }
                .all-photo{
                    position: absolute;
                    bottom: 0;
                    z-index: 99;
                    background-image: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, #000000 100%);
                    width: 100%;
                    height: 80px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 28px;
                    color: #FFFFFF;
                    i{
                        width: 26px;
                        height: 14px;
                        background: url('../../../assets/images/teaching-topic/icon-jiantou.png');
                        background-size: 26px 14px;
                        margin-left: 8px;
                    }
                }
                .box-text{
                    font-size: 28px;
                    color: #1C1C1C;
                }
                .box-text-one{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display:-webkit-box; 
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:3;
                }
                .box-btn{
                    font-size: 28px;
                    color: #00AAFF;
                    margin-top: 8px;
                    margin-bottom: 20px;
                }
                video{
                    width: 100%;
                }
            }
            .course-progress-small{
                margin-top: 40px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                p{
                    font-size: 28px;
                    color: #1C1C1C;
                    font-weight: 400;
                    margin: 0 12px;
                }
                i{
                    width: 50px;
                    height: 30px;
                }
            }
            .task-progress{
                margin-top: 60px;
                p{
                    max-width: 400px;
                }
            }
            .task-project{
                margin-bottom: 12px;
            }
            .task-progressed{
                width: 630px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                img{
                    width: 100%;
                    margin-top: 10px;
                }
                video{
                    width: 100%;
                    margin-top: 10px;
                }
                .more-task{
                    width: 630px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 20px;
                    background: #FFFFFF;
                    border: 2px solid #00AAFF;
                    border-radius: 44px;
                    font-size: 28px;
                    color: #00AAFF;
                }
            }
            .end{
                width: 630px;
                height: 170px;
                margin-top: 40px;
            }
        }
    }
}
</style>