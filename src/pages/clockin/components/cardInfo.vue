<template>
    <div class="content">
        <div class="card-info" :class="topicTaskProgress ? '' : 'no-data'">
        <div class="title">{{titleText}}<img v-if="topicTaskProgress && topicTaskProgress.finishStatus && isMedalFlag && (themeStatus == 1 || themeStatus == 2)" src="../../../assets/images/qinzi/icon-arrow-1@2x.png" alt=""></div>
        <div class="card-btm" v-if="topicTaskProgress" @click="toMedal">
            <div class="card">
                <span class="num">{{numThousand(topicTaskProgress.attendanceCount)}}</span>
                <span>累计打卡</span>
            </div>
            <div class="card">
                <span class="num">{{numThousand(topicTaskProgress.praiseCount)}}<span v-if="agreeNum" class="new fadeInUp animated">+{{numThousand(agreeNum)}}</span></span>
                <span>点赞</span>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { getUrlParam } from 'szyutils'
import { jsToClient } from '@/utils/client'
export default {
    name: 'cardInfo',
    data () {
        return {
            titleText: ''
        }
    },
    props: {
        topicTaskProgress: '',
        todayAttendance: {
            type: Boolean
        },
        totalDay: null,
        joinStatus: null, //主题参与状态：1，已参与；0，未参与
        themeStatus: null, //活动状态0 未开始 1 正常 2 已结束
        isMedalFlag: null, //是否有勋章  1 有勋章 0无勋章
        agreeNum: null, // 点赞新增人数 0表示无点赞人数或者已读
        medal: null
    },
    methods: {
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
         // 查看勋章
        toMedal(){
            if (this.topicTaskProgress && this.topicTaskProgress.finishStatus && this.isMedalFlag && (this.themeStatus == 1 || this.themeStatus == 2)) {
                jsToClient('jumpTo', {
                action: 'html',
                data: {
                    url: `${window.location.origin}/baby-task/clockin/clockin-success?topicId=${getUrlParam('topicId')}&isfrom=1&from=2`
                }
                })
                event.stopPropagation()
            }
        },
        getText () {
            if (!this.topicTaskProgress) {
                // 未参与文案  isMedalFlag 1有勋章 0无勋章
                this.titleText = this.isMedalFlag ? `快来参与打卡吧，坚持${this.totalDay}天就可获得【${this.medal.medalName}】勋章!` : '快来参与打卡吧！'
            } else {
                if (this.themeStatus == 2) {
                    // themeStatus 2 话题已经结束  topicTaskProgress.finishStatus  1打卡已经完成 0 打卡未完成 isMedalFlag 1有勋章 0无勋章
                    if (this.topicTaskProgress.finishStatus) {
                        this.titleText = this.isMedalFlag ? `完成打卡，恭喜您获得【${this.medal.medalName}】勋章！` : '真棒，您已完成打卡啦！'
                    } else {
                        this.titleText =  '活动结束了，看看其他人的精彩作品吧'
                    }
                } else if (this.themeStatus == 1) {
                    // themeStatus 1 话题正常还没结束  topicTaskProgress.finishStatus  1打卡已经完成 0 打卡未完成 isMedalFlag 1有勋章 0无勋章
                    if (this.topicTaskProgress.finishStatus) {
                        this.titleText = this.isMedalFlag ? `真棒，您已完成打卡，恭喜您获得【${this.medal.medalName}】勋章！` : '真棒，您已完成打卡啦！'
                    } else {
                        // todayAttendance 1表示今日打卡 0表示今日未打开 agreeNum 0表示无赞或者已经查看点赞
                        if (this.todayAttendance) {
                            if (this.agreeNum) { // 今日已经打卡 且有点赞数且无查看
                                this.titleText = `新增${this.numThousand(this.agreeNum)}个点赞，去邀请好友点赞提升排名吧`
                            } else {
                                this.titleText = '今日已打卡，去邀请好友点赞提升排名吧'
                            }
                        } else {
                            if (this.agreeNum) { // 今日未打卡 且有点赞数且无查看
                                this.titleText = `新增${this.numThousand(this.agreeNum)}个点赞，去打卡获得更多点赞吧`
                            } else {
                                this.titleText = this.isMedalFlag ? `今日未打卡，再坚持${this.totalDay-this.topicTaskProgress.attendanceCount}天就可获得【${this.medal.medalName}】勋章！` : '今日未打卡，快去打卡吧！'
                            }
                        }
                    }
                }
            }
        }
    },
    watch: {
        topicTaskProgress (newV, oldV) {
            this.getText()
        },
        themeStatus (newV, oldV) {
            this.getText()
        },
        totalDay (newV, oldV) {
            this.getText()
        }
    }
}
</script>

<style scoped lang="scss">
.content{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    .card-info{
        width: 702px;
        height: 182px;
        background: url('../../../assets/images/qinzi/bg-daka@2x.png');
        background-size: 702px 182px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title{
            width: 640px;
            height: 32px;
            font-size: 26px;
            color: #1C1C1C;
            margin-top: 19px;
            text-align: left;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
                width: 32px;
                height: 32px;
                margin-left: 8px;
            }
        }
        .card-btm{
            margin-top: 12px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .card{
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #1C1C1C;
                .num{
                    font-size: 48px;
                    line-height: 40px;
                    position: relative;
                    font-weight: bold;
                }
                span{
                    font-size: 24px;
                    margin-top: 10px;
                }
                .new{
                    position: absolute;
                    font-size: 22px;
                    color: #E90000;
                    font-weight: 400;
                    top: -20px;
                    white-space: nowrap;
                }
            } 
        }
    }
    .no-data{
        width: 702px;
        height: 70px;
        background: url('../../../assets/images/qinzi/bg-nodaka@2x.png');
        background-size: 702px 70px;
    }
}

</style>