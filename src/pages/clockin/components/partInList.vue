<template>
  <div class="partInList">
    <div class="lt" @click="toDetail(item)" v-for="(item,index) in partInDataArr" :key="index">
        <div class="imt">
          <img v-if="item.cover" :src="item.cover" />
          <img v-else src="../../../assets/images/qinzi/icon_imgnone1.png" />
          <span class="spn" v-if="item.finishStatus">任务完成</span>
        </div>
        <div class="content">
          <div class="content-title">{{item.title}}</div>
          <div class="content-day">打卡<span>{{item.attendanceCount}}</span>/<span class="">{{item.totalDay}}</span>天</div>
        </div>
        <template v-if="indexType==0&&item.finishStatus==0">
            <div class="toBtn toBtn1" @click="toDetail(item)" v-if="item.todayAttendance">查看</div>
            <div class="toBtn toBtn1" @click="toClockIn(item)" v-else>去打卡</div>
        </template>
        <div class="toBtn toBtn1" @click="toDetail(item)" v-if="indexType==1&&item.finishStatus==0">查看</div>
        <div class="toBtn toBtn2" @click="toMedal(item)" v-if="item.finishStatus==1">查看勋章</div>
      </div>
  </div>
</template>

<script>
const BASE_URL = window.location.origin
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
export default {
  name: "partInList",
  props:{
    partInDataArr: {
      type: Array,
      default () {
        return []
      }
    },
    indexType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      studentId: ''
    };
  },
  beforeCreate(){
    getUserInfo(this.$store).then(userInfo => {
      this.studentId = userInfo.student_uid
    })
  },
  created() {
  },
  mounted () {

	},
  methods: {
    toDetail(val){
      jsToClient('jumpTo', {
        action: 'html',
        data: {
          url: `${BASE_URL}/baby-task/clockin/clockin-theme?topicId=` + val.topicId
        }
      })
      event.stopPropagation()
    },
    // 去打卡
    toClockIn(val){
      jsToClient('jumpTo',{
        action: 'publishChildSignCard',  //跳转到原生视频打卡发布页
        data: {
          topicId: val.topicId,
          topicName: '#' + val.title + '#'
        }
        
      })
      event.stopPropagation()
    },
    // 查看勋章
    toMedal(val){
      // 关闭当前页面
      // jsToClient('jumpTo', {
      //   action: 'finish'
      // })
      // 跳转到打卡成功页
      jsToClient('jumpTo', {
        action: 'html',
        data: {
          url: `${BASE_URL}/baby-task/clockin/clockin-success?topicId=` + val.topicId + '&isfrom=1&from=1'
        }
      })
      // this.$router.push({
			// 	path: '/clockin/clockin-success?topicId=' + val.topicId
			// })
      event.stopPropagation()
    }
  }
};
</script>

<style lang="scss" scoped>
.partInList{
  font-size: 28px;
  .lt{
    padding: 40px 24px 0;
    position: relative;
    display: flex;
		justify-content: space-between;
    align-items: center;
    color: #1C1C1C;
    .imt{
      line-height: 0;
      margin-right: 20px;
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      width: 120px;
      height: 120px;
      .spn{
        display: block;
        width: 100%;
        height: 30px;
        font-size: 22px;
        text-align: center;
        color: #fff;
        position: absolute;
        left: 0;
        bottom: 0;
        line-height: 30px;
        padding: 23px 0 7px;
        background: url("../../../assets/images/qinzi/icon_mask.png") no-repeat left bottom;
        background-size: 100%;
      }
      img{
        width: 120px;
        height: 120px;
      }
    }
    .content{
      flex: 1;
      .content-title{
        width: 382px;
        font-size: 36px;
        line-height: 48px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: bold;
      }
      .content-day{
        margin-top: 5px;
        font-size: 24px;
        line-height: 33px;
        color: #999;
      }
    }
    .toBtn{
      width: 140px;
      height: 62px;
      line-height: 65px;
      text-align: center;
      border-radius: 30px;
      font-size: 28px;
    }
    .toBtn1{
      background: #FFD100;
		  color: #1C1C1C;
    }
    .toBtn2{
      background: rgba(255,209,0,0.16);
      color: #FFA800;
    }
  }
}
</style>
