<template>
  <div class="honorList">
    <div class="honorRoll-lt" v-for="(item,index) in honorDataArr" :key="index" @click="toVideo(item)">
      <div class="num">
        <div class="spn" v-if="selectValNum==0 || selectValNum==2">{{index+1>500?'500+':(index+1)}}</div>
        <div class="spn" v-else>{{index+1>20?'20+':(index+1)}}</div>
      </div>
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
          <div class="text-name">
            <div class="name">{{item.trueName}}</div>
          </div>
          <div class="text-cardNum" v-if="indexNum==1">已坚持打卡{{item.attendanceDay}}次</div>
          <div class="text-cardNum" v-else>获赞{{item.praiseCount|numThousand}}个</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BASE_URL = window.location.origin
export default {
  name: "honorList",
  props:{
    honorDataArr:{
      type: Array,
      default: []
    },
    indexNum:{
      type: Number,
      default: 1
    },
    topicTaskData: {
      type: Object,
      default:{}
    },
    selectValNum:{
      type: Number,
      default: 0
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
    }
  },
  data() {
    return {

    };
  },
  created() {
  },
  mounted () {

	},
  methods: {
    toVideo(data){
      this.$emit('toVideo',data)
    }
  }
};
</script>

<style lang="scss" scoped>
.honorList{
  background: #fff;
  font-size: 28px;
  .honorRoll-lt{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 29px 25px 0;
    position: relative;
    .num{
      width: 86px;
      text-align: center;
      font-size: 34px;
      color: #818D9D;
    }
    .content{
      flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      .content-img{
        line-height: 0;
        img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .content-text{
        flex: 1;
        margin-left: 20px;
        .text-name{
          font-size: 30px;
          height: 42px;
          color: #333333;
          display: flex;
          align-items: center;
          .name{
            max-width: 260px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .myNum{
            margin-left: 16px;
            background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
            background-image: linear-gradient(90deg, #FF9602 4%, #FFE061 100%);
            border-radius: 20px;
            width: 109px;
            height: 28px;
            color: #fff;
            font-size: 20px;
            text-align: center;
          }
        }
        .text-cardNum{
          font-size: 24px;
          color: #BBBBBD;
          margin-top: 3px;
          line-height: 33px;
        }
      }
    }
  }
  .honorRoll-lt::before{
    content: '';
    height: 2px;
    background: #eee;
    position: absolute;
    right: 0;
    left: 186px;
    bottom: 0;
    transform: scaleY(.5);
  }
  .honorRoll-lt::after{
    content: '';
    width: 14px;
    height: 22px;
    background: url("../../../assets/images/qinzi/icon_enter_yellow.png") no-repeat center;
    background-size: 100%;
    position: absolute;
    right: 29px;
    top: 50%;
    margin-top: -11px;
  }
  .honorRoll-lt:nth-child(1) .num .spn,
  .honorRoll-lt:nth-child(2) .num .spn,
  .honorRoll-lt:nth-child(3) .num .spn{
    width: 32px;
    height: 42px;
    margin: 0 auto;
    font-size: 0;
  }
  .honorRoll-lt:nth-child(1) .num .spn{
    background: url("../../../assets/images/qinzi/icon_gold.png") no-repeat center;
    background-size: 100%;
  }
  .honorRoll-lt:nth-child(2) .num .spn{
    background: url("../../../assets/images/qinzi/icon_silver.png") no-repeat center;
    background-size: 100%;
  }
  .honorRoll-lt:nth-child(3) .num .spn{
    background: url("../../../assets/images/qinzi/icon_copper.png") no-repeat center;
    background-size: 100%;
  }
} 
</style>
