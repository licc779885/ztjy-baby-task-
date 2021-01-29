<template>
  <div class="honorRoll-my honorRoll-lt" @click="toVideo(currentStudentData)">
    <div class="num">
      <template v-if="selectValNum==0 || selectValNum==2">
        <div class="spn" v-if="currentStudentData.rank==0"></div>
        <div class="spn" v-else-if="currentStudentData.rank>0&&currentStudentData.rank<=500">{{currentStudentData.rank}}</div>
        <div class="spn" v-else>500+</div>
      </template>
      <template v-else>
        <div class="spn" v-if="currentStudentData.rank==0"></div>
        <div class="spn" v-else-if="currentStudentData.rank>0&&currentStudentData.rank<=20">{{currentStudentData.rank}}</div>
        <div class="spn" v-else>20+</div>
      </template>
    </div>
    <div class="content">
      <div class="content-img">
        <template v-if="currentStudentData.userPic">
          <img :src="currentStudentData.userPic" />
        </template>
        <template v-else>
          <img v-if="currentStudentData.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
          <img v-if="currentStudentData.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
        </template>
      </div>
      <div class="content-text">
        <div class="text-name">
          <div class="name">{{currentStudentData.trueName}}</div>
          <div class="myNum">当前排名</div>
        </div>
        <div class="text-cardNum" v-if="indexNum==1">已坚持打卡{{currentStudentData.attendanceDay}}次</div>
        <div class="text-cardNum" v-else>获赞{{currentStudentData.praiseCount|numThousand}}个</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "honorList",
  props:{
    currentStudentData:{
      type: Object,
      default: {}
    },
    indexNum:{
      type: Number,
      default: 1
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
.honorRoll-my{
  margin-bottom: 20px;
  background: #fff;
}
.honorRoll-lt{
  font-size: 28px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 29px 25px 0;
  position: relative;
  .num{
    width: 90px;
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
        color: #333333;
        display: flex;
        align-items: center;
        .name{
          max-width: 200px;
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
          line-height: 30px;
          color: #fff;
          font-size: 22px;
          text-align: center;
        }
      }
      .text-cardNum{
        font-size: 24px;
        color: #BBBBBD;
        margin-top: 3px;
      }
    }
  }
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
</style>
