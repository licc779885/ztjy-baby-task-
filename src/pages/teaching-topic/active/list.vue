<template>
    <div class='contain'>
        <div v-if='!isActive' class="contain-btm">
            <div class="content"  v-html="content"></div>
            <div class="btm">
                <div class="txt"  v-if="documentTxt['JNHD-A001'] && documentTxt['JNHD-A001'].length && firstFlag"><p>{{documentTxt['JNHD-A001']}}</p></div>
                <div v-show="onlineStatus==1" class="btn" @click="selectNext">{{isweiX ? '' : '打开掌通家园园丁'}}领取教学资料</div>
                <div ref='downLoad' style="display: none"></div>
                <div v-show="onlineStatus==0" class="end-btn">活动已下线</div>
            </div>
            <select-class ref="class" @complete='selectClass' :selection='classId'></select-class>
            <select-time  @complete='selectTime' ref='time'></select-time>
        </div>
        <no-active v-else></no-active>
    </div>
</template>
<script>
import { jsToClient, clientToJs, namespace } from '@/utils/client'
import selectClass from '@/components/select-class'
import selectTime from '@/components/select-date-range'
import { getDocument, isJoinCheck, getActiveDetail, joinActive } from '@/services/index'
import noActive from './components/no-active'
import { getUrlParam, versionCompare } from 'szyutils'
import { mapGetters } from "vuex";
import { Toast } from 'vant'
const moment = require('moment');
export default {
    name: 'list',
    components: {
        selectClass,
        selectTime,
        noActive
    },
    computed: {
        ...mapGetters({
            isChangeDate:'teaching-topic/isChangeDate',
            // classList:'teaching-topic/classList',
            userInfo: 'global/userInfo'
        }),
    },
    watch: {
        isChangeDate(value){
            this.$refs.time.show()
        }
    },
    data () {
        return {
            content: '',
            documentTxt: {},
            isweiX: null,
            onlineStatus: null,
            classId: '',
            materialFile: '',
            title: '',
            firstFlag: null,
            isActive: false,
            classList: []
        }
    },
    mounted () {
        this.init()
        this.isweiX = namespace ? 1 : 0
        if (namespace) {
            this.$store.dispatch('global/getUserInfo').then(() => {
                console.log(this.userInfo.user_type)
                if (!window.localStorage.getItem(this.userId)) {
                    this.firstFlag = 1
                    setTimeout(() => {
                        this.firstFlag = 0
                    }, 3000)
                    window.localStorage.setItem(this.userId, 1)
                } else {
                    this.firstFlag = 0

                }
                this.getDocument(this.userInfo.school_id)
                this.getActiveDetail()
            })
        } else {
            this.getActiveDetail()
        }
        jsToClient('getClassInfoList',{type: 2}).then((data)=> {
            console.log(data)
            this.classList = JSON.parse(data).gradeClassList
        })
        this.openWX()
        this.$store.dispatch('teaching-topic/setActivetyId',getUrlParam('teachingActivityId'))
    },
    methods: {
        selectNext () {
            if (namespace) {
                if (versionCompare(this.userInfo.st.app_ver, '6.34.0') == -1) {
                    Toast('请升级至最新版本再试')
                    return
                }
                if (this.userInfo.user_type == 2) {
                    this.ev({
                        event_id: 'click_receive_material_pack',
                        obj_id: getUrlParam('teachingActivityId'),
                        parm: getUrlParam('scheduleId')
                    })
                    this.downloadEvent()
                } else {
                    this.ev({
                        event_id: 'click_receive_material_pack',
                        obj_id: getUrlParam('teachingActivityId'),
                        parm: getUrlParam('scheduleId')
                    })
                    if (!this.classList.length) {
                        this.ev({
                            event_id: 'click_receive_material_pack',
                            obj_id: getUrlParam('teachingActivityId'),
                            parm: getUrlParam('scheduleId')
                        })
                        Toast('您当前没有任教班级')
                        setTimeout(() => {
                            this.downloadEvent()
                        }, 300)
                        return
                    } else if (this.classList.length === 1) {
                        this.classId = this.classList[0].classId
                    }
                    let param = {
                        teachingActivityId: getUrlParam('teachingActivityId'),
                        userId: this.userInfo.uid,
                        schoolId: this.userInfo.school_id,
                        classId: this.classId
                    }
                    isJoinCheck(param).then(res => {
                        if (res.code && res.code !== 10000) {
                            Toast(res.message)
                            return
                        }
                        if (res.isJoined) {
                            jsToClient('jumpTo', {
                                action: 'html',
                                data: {
                                    title: '课程安排',
                                    url: window.domain + '/teaching-topic/plan-course?teachingActivityJoinId=' + res.teachingActivityJoinId
                                }
                            })
                            // this.$router.push({path: '/teaching-topic/plan-course', query: {teachingActivityJoinId: res.teachingActivityJoinId}})
                        } else {
                            if (res.isConflict) {
                                Toast({
                                    message: `当前班级已被同班的${res.conflictTeacherInfo.teacherName}抢先预约开课啦`,
                                    position: 'top'
                                })
                            } else {
                                if (this.classList.length === 1) {
                                    this.$refs.time.show()
                                } else {
                                    Toast({
                                        message: '您当前有多个任教班级，请先选择开课班级',
                                        position: 'top'
                                    })
                                    setTimeout(() => {
                                        this.$refs.class.show()
                                    }, 1000)
                                }
                            }
                        }

                    })
                }
            } else {
                window.szyDownload.openApp()
            }
        },
        init () {
            window.szyDownload.init({
                downLoadInfo: {
                    type: 'download_btn_radius',
                    parentNode: this.$refs.downLoad, // 传入父节点
                    buttonText: '下载掌通家园',
                    appType: 'teacher' // teacher 代表需要下载园丁端渠道包，parent代表需要下载家长端渠道包，默认值是parent
                },
                clickListener: true
            })
            this.pv({
                page: 'topic_introduction',
                page_category: 2,
                parm: getUrlParam('scheduleId'),
                f_page_location: 'curriculum_card'
            })
        },
        getActiveDetail () {
            let param = {
                teachingActivityId: getUrlParam('teachingActivityId'),
                userId: this.userInfo.uid
            }
            getActiveDetail(param).then(res => {
                if (res.code && res.code === 10001) {
                    this.isActive = true
                    document.title = '活动名称'
                    return
                }
                if (res.code && res.code !== 10000) {
                    Toast(res.message)
                    return
                }
                document.title = res.title
                this.title = res.title
                this.content = res.content
                this.onlineStatus = res.onlineStatus
                this.materialFile = res.materialFile ? JSON.parse(res.materialFile) : {}
            })
        },
        selectClass (object) {
            this.classId = object.classId
        },
        selectTime (time) {
            let param = {
                teachingActivityId: getUrlParam('teachingActivityId'),
                userId: this.userInfo.uid,
                startDate: time,
                classId: this.classId
            }
            console.log(param, '入参')
            joinActive (param).then(res => {
                if (res.code && res.code !== 10000) {
                    Toast(res.message)
                    return
                }
                jsToClient('jumpTo', {
                    action: 'html',
                    data: {
                        title: '课程安排',
                        url: window.domain + '/teaching-topic/plan-course?teachingActivityJoinId=' + res.teachingActivityJoinId
                    }
                })
            })
        },
        getDocument (schoolId) {
            getDocument({schoolId,positionKeys:'JNHD-A001,JNHD-A004,JNHD-A005'}).then(res => {
                this.documentTxt = res
            })
        },
        downloadEvent(){
            if (versionCompare(this.userInfo.st.app_ver, '6.34.0') == -1) {
                Toast('请升级至最新版本再试')
                return
            }
            jsToClient('jumpTo', {
                action: 'startDownloadFile',
                data: {
                    name: this.materialFile.name,
                    fileId: this.materialFile.fileId,
                    size: this.materialFile.size, // 单位：B
                    type: this.materialFile.type,
                    url: this.materialFile.url
                }
            })
        },
        openWX () {
            if (!namespace) {
                return
            }
            this.ev({
                event_id: 'click_topic_sharing',
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
                        }
                    ],
                    title: this.documentTxt['JNHD-A004'].replace(/「活动名称」/g, this.title),
                    url: window.domain + '/teaching-topic/active/list?teachingActivityId=' + getUrlParam('teachingActivityId'),
                    content: this.documentTxt['JNHD-A005']
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
  .contain{
    width: 100%;
    height: 100%;
    .contain-btm{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        // overflow: hidden;
    }
    .content{
      background: #fff;
      font-size: 28px;
      color: #818D9D;
      word-break: break-all;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      flex:1;
      /deep/ img {
        width: 100%;
        vertical-align: middle;
      }
      p {
        max-height: none;
      }
    }
    .btm{
      width: 100%;
      padding: 30px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 16;
      position: relative;
      .txt{
        width: 478px;
        height: 218px;
        background: url('../../../assets/images/teaching-topic/btn-bg.png');
        background-size: 478px 218px;
        position: absolute;
        top: -190px;
        z-index: 30;
        p{
          margin-left: 53px;
          margin-top: 45px;
          width: 228px;
          height: 120px;
          font-size: 28px;
          color: #FFFFFF;
          line-height: 40px;
          font-weight: 600;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:3;
        }
      }
      .btn{
        width: 590px;
        height: 88px;
        background: #00AAFF;
        border-radius: 44px;
        font-size: 36px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .end-btn{
        width: 590px;
        height: 88px;
        background: #D4DCE8;
        border-radius: 44px;
        font-size: 36px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
