<template>
  <div class="rank-content">
    <div class="theme-rank" @click="toDetail">
      <div class="rank-title">
        <div class="title-text">{{rangeNum==0?'全国':'班级'}}获赞荣誉榜</div>
        <div class="title-more">更多</div>
      </div>
      <div class="rank-list">
        <div class="lt" v-for="(item,index) in topicTaskStudentArr.slice(0,3)" :key="index">
          <div class="num"><div class="spn"></div></div>
          <div class="content">
            <div class="content-img">
              <template v-if="item.userPic">
                <img :src="item.userPic" />
              </template>
              <template v-else>
                <img v-if="item.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
                <img v-if="item.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
              </template>
            </div>
            <div class="content-text">
              <div class="text-name">{{item.trueName}}</div>
              <div class="text-cardNum">获赞{{item.praiseCount|numThousand}}个</div>
              <!-- <div class="text-cardNum" v-else>已坚持打卡{{item.attendanceDay|numThousand}}次</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import { browserInfo } from '@/utils/_tool.js'
import { Toast } from 'vant'
const BASE_URL = window.location.origin
const isIos = browserInfo().isIos
export default {
  name: "themeRank",
  props: {
    rangeNum: {
      type: Number,
      default: 0
    },
    topicIdVal:{
      type: String,
      default: ''
    },
    topicTaskStudentArr: {
			type: Array,
			default () {
        return []
      }
    },
    topicTypeData: {
      type: Number,
      default: 0
    },
    todayAttendanceType: {
      type: Boolean,
      default () {
        return false
      }
    },
    topicTaskStatusNum: {
      type: Number,
      default: 1
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
  },
  data() {
    return {
      studentId: '',
      isEnableImmersion: ''
    };
  },
  beforeCreate(){
    getUserInfo(this.$store).then(userInfo => {
      this.studentId = userInfo.student_uid
      if (versionCompare(userInfo.st.app_ver, '6.34.0') >= 0) {
        this.isEnableImmersion = true
      }
    })
  },
  created() {
  },
  mounted () {

	},
  methods: {
    toDetail(val){
      // 事件埋点
      onStatisticEvent(2, {
        event_id: 'towntalk_billboard_click',
        obj_id: this.topicIdVal
      })
      if(isIos){
        jsToClient('updateBarStatus', {
          type:'topBar',
          visible:true
        })
      }
      if(this.isEnableImmersion){
        // 跳转到排行榜
        jsToClient('jumpTo', {
          action: 'html',
          data: {
            url: `${BASE_URL}/baby-task/clockin/clockin-honor?studentId=` + this.studentId + '&range=' + this.rangeNum + '&topicId=' + this.topicIdVal + '&progressDetailId=' + val.progressDetailId + '&topicType=' + this.topicTypeData + '&todayAttendance=' + this.todayAttendanceType + '&topicTaskStatus=' + this.topicTaskStatusNum
          }
        })
      }else{
        Toast('只有新版本才能查看当前内容')
      }
      
    }
  }
};
</script>

<style lang="scss" scoped>
.rank-content{
  font-size: 28px;
  .theme-rank{
		margin-top: 15px;
		background: #F8F8F7;
		border-radius: 16px;
    padding: 20px 20px 30px 20px;
    .rank-title{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
      color: #1C1C1C;
      font-weight: bold;
    }
    .title-more{
		  color: #FFA800;
      padding-right: 13px;
      background: url("../../../assets/images/qinzi/icon_enter_yellow1.png") no-repeat right center;
      background-size: 9px;
      font-size: 24px;
      font-weight: bold;
    }
    .rank-list{
      .lt{
        margin-top: 20px;
        display: flex;
        align-items: center;
        .num{
          width: 32px;
          margin-right: 16px;
          display: flex;
          align-items: center;
          .spn{
            width: 32px;
            height: 42px;
          }
        }
        .content{
          display: flex;
          align-items: center;
          .content-img{
            margin-right: 10px;
            line-height: 0;
            img{
              width: 64px;
              height: 64px;
              border-radius: 50%;
            }
          }
          .text-name{
            max-width: 140px;
            height: 33px;
            font-size: 24px;
            color: #1C1C1C;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-bottom: 3px;
          }
          .text-cardNum{
            font-size: 20px;
            color: #818D9D;
            line-height: 28px;
          }
        }
      }
      .lt:nth-child(1) .num .spn{
        background: url("../../../assets/images/qinzi/icon_gold.png") no-repeat center;
        background-size: 100%;
      }
      .lt:nth-child(2) .num .spn{
        background: url("../../../assets/images/qinzi/icon_silver.png") no-repeat center;
        background-size: 100%;
      }
      .lt:nth-child(3) .num .spn{
        background: url("../../../assets/images/qinzi/icon_copper.png") no-repeat center;
        background-size: 100%;
      }
    }
	}
}
</style>
