<template>
    <div class="plan-list">
        <div class="block-module-list">
            <div class="start-time-block module">
                <div class="left">
                    <!-- 开课时间 mm-dd -->
                    <strong v-if="!isLater">预计开课时间：{{getMonthDay}}</strong>
                    <strong v-else >开课时间：{{getMonthDay}}</strong>
                    <span>这天你选择开课啦!</span>
                </div>
                <!-- <div class="right" @click="changeDate" v-if="!isLater"> -->
                    <div class="right" @click="changeDate">
                <!-- <div class="right" @click="changeDate" >  -->
                    <span class="normal-btn">更换开课时间</span>
                </div>
                <div class="time-line bottom">
                    <div class="line"></div>
                    <div class="circle-ico"></div>
                </div>
            </div>
            <div class="line-block"></div>
            <div class="course-block block-list module no-padding">
                <div class="box" @click="linkCourse">
                    <div class="left">
                        <div class="pic">
                            <img :src="plan.course.cover" alt="">
                        </div>
                        <span>{{splitStr(plan.course.title)}}</span>
                    </div>
                    <div class="right">
                        <span class="normal-btn">查看</span>
                    </div>
                </div>
                <div class="change-area" @click="changeCourse">
                    更换课程
                </div>
                <div class="time-line">
                    <div class="line"></div>
                    <div class="circle-ico"></div>
                </div>
            </div>
            <div class="line-block"></div>
            <div class="dynamic-block module">
                <div class="title" :class="plan.growth.growthId ? 'title-txt' : ''">
                    <template  v-if="plan.growth.growthId">
                           <span class="noraml">课程精彩瞬间</span>
                           <div class="noraml-txt">若需编辑此条动态，请前往动态模块操作。</div>
                    </template>
                    <template v-else >
                        <div class="pic">
                            <img :src="defaultImg" alt="">
                        </div>
                        <div class="text">{{JNHDA007}}</div>
                    </template>
                </div>
                <div class="text-box" :class="spreadFlag?'text-box-one':''" v-if="plan.growth.text && plan.growth.text.length">{{plan.growth.text}}</div>
                <div class="text-box-btn" v-if="plan.growth.text && plan.growth.text.length" @click='spreadFlag = !spreadFlag'>{{spreadFlag? '全文' : '收起'}}</div>
                <push-dynamic :imageList="plan.growth.images" :growthId="plan.growth.growthId"></push-dynamic>
                <video v-if='plan.growth.videos && plan.growth.videos.length' :src="plan.growth.videos[0].videoUrl" :poster='plan.growth.videos[0].videoUrl+"?vframe/jpg/offset/0/rotate/auto"' controls  x5-video-player-type='h5-page' t7-video-player-type="inline" playsinline="isiPhoneShowPlaysinline"  webkit-playsinline="isiPhoneShowPlaysinline" x-webkit-airplay="" preload="none" ></video>
                <div class="time-line">
                    <div class="line"></div>
                    <div class="circle-ico"></div>
                </div>
            </div>
            <div class="line-block"></div>
            <div class="task-block module no-padding">
                <div class="box">
                    <div class="title">{{JNHDA008}}</div>
                    <div class="tip">
                        开课后，掌通助手将帮您定时发布亲子任务
                    </div>
                    <div class="close-btn" @click="taskEvent">
                        <template v-if="plan.taskOnlineStatus == 1">关闭亲子任务</template>
                        <template v-else >开启亲子任务</template>
                    </div>
                    <div class="line"></div>
                    <div class="block-list">
                        <div class="box"  @click="lookTask">
                            <div class="left">
                                <div class="pic">
                                    <img :src="plan.growthTask.cover" alt="">
                                </div>
                                <span>{{splitStr(plan.growthTask.title)}}</span>
                            </div>
                            <div class="right">
                                <span class="normal-btn">查看</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="change-area" v-if="!isLater" @click="changeTask"> -->
                <div class="change-area" @click="changeTask">
                    更换亲子任务
                </div>
                 <div class="time-line">
                    <div class="line top"></div>
                    <div class="circle-ico"></div>
                </div>
            </div>
        </div>
        <select-date-range ref="selectDate" v-model="defaultDate" @complete="changeDateEvent" v-if="defaultDate"></select-date-range>
        <select-date-range ref="createDate" v-model="defaultDateForCreate" @complete="changeCreateDateEvent"></select-date-range>
    </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import pushDynamic from './push-dynamic'
import { DatetimePicker } from 'vant';
import selectDateRange from '@/components/select-date-range'
import { changeStartTime, updateSwitch, joinActive } from '@/services/teaching-topic'
import { mapState, mapGetters } from "vuex"
import { jsToClient, clientToJs, namespace } from '@/utils/client'
const moment = require('moment')
const defaultImg = require('@/assets/images/teaching-topic/logo@2x.png')
export default ({
    name: 'plan-list',
    components: {
        [pushDynamic.name]:pushDynamic,
        [selectDateRange.name]:selectDateRange,
    },
    props:{
        plan:{
            type: Object,
            default: {
                
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => {
                return state.global.userInfo
            },
        }),
        ...mapGetters({
            userId:'global/userId',
            teachingActivityId: 'teaching-topic/teachingActivityId',
            teachingActivitieJoinId: 'teaching-topic/teachingActivitieJoinId',
            isChangeDate:'teaching-topic/isChangeDate',
            JNHDA007:'teaching-topic/JNHDA007',
            JNHDA008:'teaching-topic/JNHDA008',
            JNHDA0011:'teaching-topic/JNHDA0011',
            JNHDA0013:'teaching-topic/JNHDA0013',
            callbackKey: 'teaching-topic/callbackKey',
            classId: 'teaching-topic/classId',
            schoolId: 'global/schoolId',
            currentClassId: 'teaching-topic/currentClassId',
            isOldVersion: 'teaching-topic/isOldVersion',
        }),
        courseTitle(value){
            if(value.length > 20){
                return value.subString(0,value.length)+'...'
            }else{
                return value
            }
        },
        getMonthDay(){
            if(this.defaultDate){
                return moment(this.defaultDate).format('MM-DD')
            }else{
                return ''
            }
        },
        isLater(){
            let currentDate = moment()
            let newDate = moment(this.plan.startDate)
            let diff = currentDate.diff(newDate)
            return diff<0?false:true
        },
        defaultDate(){
            let defaultDate = ''
            if(this.plan.startDate){
                let startDate = new Date(this.plan.startDate)
                defaultDate = moment(startDate).format('YYYY-MM-DD')
            }
            return defaultDate
        }
    },
    watch: {
        isChangeDate(value){
            this.changeCreateDate()
        },
        createoJinIdStatus(){
         
        }
    },
    data () {
        Dialog.setDefaultOptions({
            className:'task-confirm'
        })
        return {
            defaultImg,
            showDate: false,
            defaultDateForCreate:'',
            currentChange: false,
            spreadFlag: true
        }
    },
    created () {
        jsToClient('jumpTo', {
            action: 'autoRefresh',
            data: {
				needRefresh: true
			}
        })
        clientToJs('autoRefreshCallback',()=>{
            if(this.currentChange){
                this.currentChange = false
                this.$store.dispatch('teaching-topic/refresh').then(()=>{
                    // this.$toast.success('更换成功')
                })
                
            }
        })
    },
    mounted () {
        
    },
    methods:{
        changeDate(){
            this.ev({
                event_id: 'click_change_start_time',
                obj_id: this.teachingActivityId
            })
            this.$refs['selectDate'].show()
        },

        changeCreateDate(){
            this.ev({
                event_id: 'click_change_start_time',
                obj_id: this.teachingActivityId
            })
            this.$refs['createDate'].show()
        },
        
        // 开启和关闭亲子任务事件
        taskEvent(){
            if(this.plan.taskOnlineStatus == 1){
                this.endConfirmTask()
            }else{
                this.startConfrmTask()
            }            
        },
         // 关闭亲子任务弹窗
        endConfirmTask(){
            this.pv({
                page: 'close_parent-child_task',
                page_category: 3
            })
            this.$dialog.confirm({
                title: '关闭亲子任务定时发布',
                message: this.JNHDA0011,
            }).then(res => {
                this.ev({
                    event_id: 'click_close-parent-child-task',
                    obj_id: this.teachingActivityId
                    // parm: 'golden'
                })
               this.saveChildTaskStatus(0)
            }).catch(err =>{

            })
        },
        // 开启亲子任务弹窗
        startConfrmTask(){
            if(!this.isOldVersion){
                this.pv({
                    page: 'open_parent-child_task',
                    page_category: 3
                })
                this.$dialog.confirm({
                    title: '开启亲子任务定时发布',
                    message: this.JNHDA0013,
                }).then(res => {
                    this.ev({
                        event_id: 'click_open-parent-child-task',
                        obj_id: this.teachingActivityId
                        // parm: 'golden'
                    })
                    this.saveChildTaskStatus(1)
                }).catch(err =>{

                })
            }else{
                this.$toast('请升级至最新版本再试')
            }
            
        },
        
        // 保存开启和关闭亲子任务状态
        saveChildTaskStatus(status){
            this.addLoading()
            updateSwitch({
                userId:this.userId,
                teachingActivityJoinId: this.plan.teachingActivityJoinId,
                taskOnlineStatus: status
            }).then((res)=>{
                if(res['code'] && res['code'] !== '10000'){
                    return 
                }else{
                    if(status == 1){
                        this.$toast.success('开启成功')
                    }else{
                        this.$toast.success('关闭成功')
                    }
                    this.plan.taskOnlineStatus = status
                    this.removeLoading()
                }
            }).catch((res)=>{
                alert('失败')
                this.removeLoading()
            })
        },
        // todo 点击查看亲子任务 调用DS协议
        lookTask(){
            this.ev({
                event_id: 'click_parent-child_task_card',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            const param = {
                businessId: this.teachingActivitieJoinId,
                taskId: this.plan.growthTask.taskId,
                classId: this.callbackKey, // 回调的接口
                schoolId: this.schoolId,
                hideNaviBarRightIem: true,
                successCallJs: namespace+'.homeTaskSuccess',
                failureCallJs: namespace+'.homeTaskFail',
                sendStatusCallJs: namespace+'.homeSendStatusCallJs',
            }
            jsToClient('jumpTo', {
                action: 'homeTask',
                data: param
            })
            clientToJs('homeTaskSuccess',(res)=>{
                this.$toast.success('保存成功')
                this.$store.dispatch('teaching-topic/refresh')
            })
            clientToJs('homeTaskFail',(res)=>{
                alert(res,'失败')
                this.$toast('保存失败')
            })
            // clientToJs('homeSendStatusCallJs',(res)=>{
            //     alert('状态'+ res)
            //     this.removeLoading()
            // })
        },
        // todo 在定时推送时间T-1时，不允许开启/关闭亲子任务
        juadgeCloseTask(){

        },

        // 查看课程
        linkCourse(){
            this.ev({
                event_id: 'click_class_card',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            let url =  `${window.domain}/teaching-topic/active/detail?courseId=${this.plan.course.courseId}`
            jsToClient('jumpTo',{
                action:'html',
                data:{
                    url
                }
            })
        },
        // 保存开课时间
        changeDateEvent(startDate){
            this.addLoading()
            changeStartTime({
                userId: this.userId,
                teachingActivityJoinId: this.plan.teachingActivityJoinId,
                startDate:startDate
            }).then(res=>{
                if (res.code && res.code != 10000){
                    Toast(res.message)
                    return
                }
                this.plan.startDate = startDate
                this.removeLoading()
                this.$toast.success('更改成功')
            })  
        },
        changeCreateDateEvent(startDate){
            // 确认参与 重新创建
            let param = {
                teachingActivityId: this.teachingActivityId,
                userId: this.userId,
                startDate: startDate,
                classId: this.currentClassId
            }
            console.log(param, '入参')
            joinActive (param).then(res => {
                if (res.code && res.code !== 10000) {
                    Toast(res.message)
                    return
                }
                this.$router.replace({name:'teacherIngPlanCourse',query:{teachingActivityJoinId:res.teachingActivityJoinId}})
                this.$store.dispatch('teaching-topic/refresh')
            })
        },
        changeCourse(){
            this.ev({
                event_id: 'click_change_course',
                obj_id: this.teachingActivityId
                // parm: 'golden'
            })
            this.currentChange = true
            let url =  `${window.domain}/teaching-topic/active/changeCourse?teachingActivityId=${this.teachingActivityId}&teachingActivityJoinId=${this.teachingActivitieJoinId}&userId=${this.userId}&courseId=${this.plan.course.courseId}&classId=${this.plan.classId}`
            jsToClient('jumpTo',{
                action:'html',
                data:{
                    url
                }
            })
            // this.$router.push({name:'teacherTopicActiveCourse',query:{teachingActivitieJoinId:this.teachingActivitieJoinId,courseId:this.plan.course.courseId}})
        },
        // 更改亲子任务
        changeTask(){
            this.currentChange = true
            let url =  `${window.domain}/teaching-topic/active/changeTask?teachingActivityId=${this.teachingActivityId}&teachingActivityJoinId=${this.teachingActivitieJoinId}&userId=${this.userId}&templateId=${this.plan.growthTask.templateId}&classId=${this.plan.classId}`
            jsToClient('jumpTo',{
                action:'html',
                data:{
                    url
                }
            })
        },
        // 切割固定字数的字符串
        splitStr(str){
            if(str.length > 20){
                return str.substring(0,20)+'...'
            }else{
                return str
            }
        }
    }
})
</script>
<style lang="scss">
.task-confirm {
    border-radius: 16px;
    width: 550px;
    margin-left: -275px;
    margin-top: -20%;
    transition-property: transform,opacity,-webkit-transform,margin;
    transform: none;
}
</style>
<style lang="scss" scoped>
.plan-list {
    padding: 40px 30px 40px 27px;
    background-color: rgba(242, 243, 245, 0.62);
    flex: 1;
}
.time-line {
    height:100%;
    position: absolute;
    top:0px;
    left:-20px;
    .line {
        width: 2px;
        height:100%;
        background-color:#E0E0E0;
        &.top {
            height:50%;
        }
    }
    &.bottom {
        top:50%;
    }
}
.circle-ico {
    background:url('~@/assets/images/teaching-topic/circle-ico@2x.png') no-repeat;
    background-size:100% 100%;
    width:22px;
    height:22px;
    top:50%;
    margin-top:-11px;
    left:-10px;
    position: absolute;
}
.module {
    padding:30px 30px;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(150,149,149,0.24);
    border-radius: 16px;
    position: relative;
    &.no-padding {
        padding: 0px;
    }
}
.block-module-list {
    flex:1;
    margin-left:17px;
}
.course-block {
    > .box {
        padding: 30px 30px 30px;
    }
}
.start-time-block {
    display:flex;
    justify-content:space-between;
    align-items:center;
    .circle-ico {
        top:0px;
    }
    .left {
        span,strong {
            display:block;
        }
        strong {
            font-size: 32px;
            color: #333333;
        }
        span {
            font-size: 28px;
            color: #818D9D;
        }
    }
}
.line-block {
    height:30px;
    width:2px;
    background-color:#E0E0E0;
    margin-left:-20px;
}
.normal-btn {
    border: 2px solid #00AAFF;
    border-radius: 35px;
    font-size: 30px;
    color: #00AAFF;
    padding:7px 24px;
    white-space: nowrap;
}

.change-area {
    border-top: 1px solid #ddd;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: #00AAFF;
}
.block-list {
    .box {
        display: flex;
        justify-content: space-around;
    }
    .left {
        display: flex;
        align-items: center;
        flex: 1;
        .pic {
            width: 100px;
            height: 100px;
            img {
                width: 100%;
                height: 100%; 
                object-fit: cover;
                border-radius: 16px;
            }
        }
        span {
            flex: 1;
            padding-left: 16px;
            padding-right: 20px;
            font-size: 32px;
            color: #1C1C1C;
            line-height: 48px;
        }
    }
    .right {
        display: flex;
        align-items: center;
    }
    
}
.dynamic-block  {
    .title {
        display: flex;
        align-items: center;
        // flex-direction: column;
        .pic {
            width: 60px;
            height: 60px;
        }
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        .text {
            background: rgba(255,151,0,0.06);
            border-radius: 8px;
            font-size: 26px;
            color: #FF9700;
            margin-left: 12px;
            padding: 6px 16px;
        }
        .noraml {
            font-size: 32px;
            color: #333333;
            font-weight: bold;
        }
        .noraml-txt{
            font-size: 26px;
            color: #818D9D;
        }
    }
    .title-txt{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .text-box{
        font-size: 28px;
        color: #1C1C1C;
    }
    .text-box-one{
        overflow: hidden;
        text-overflow: ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
    }
    .text-box-btn{
        margin-top: 8px;
        font-size: 28px;
        color: #00AAFF;
    }
    video{
        width: 100%;
        margin-top: 20px;
    }
}
.task-block {
    > .box {
        padding:30px 30px 0px;
    }
    .title {
        font-size: 32px;
        color: #333333;
        font-weight: bold;
    }
    .tip {
        background: rgba(255,151,0,0.06);
        border-radius: 8px;
        padding: 5px 16px;
        font-size: 26px;
        color: #FF9700;
        margin-top: 8px;
        margin-bottom: 20px;
    }
    .close-btn {
        font-size: 28px;
        color: #00AAFF;
        text-decoration: underline;
        margin-bottom: 20px;
    }
    .block-list {
        border-top: 1px solid #ddd;
        padding: 20px 0px;
    }
}
</style>