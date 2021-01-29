<template>
  <div class="themeMy" v-if="topicTaskContentData.studentInfo">
    <div class="tab-lt" @click="toVideo(topicTaskContentData,0)">
      <div class="imt"><img :src="topicTaskContentData.cover" alt="" onerror="this.style.display='none'"><i class="icon-video"></i></div>
      <div class="text">{{topicTaskContentData.content}}</div>
      <div class="dom">
        <div class="dom-imt">
          <template v-if="topicTaskContentData.studentInfo.userPic">
             <img :src="topicTaskContentData.studentInfo.userPic" />
          </template>
          <template v-else>
              <img v-if="topicTaskContentData.studentInfo.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
              <img v-if="topicTaskContentData.studentInfo.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
          </template>
          <span class="studentName">{{topicTaskContentData.studentInfo.trueName}}</span>
        </div>
        <div class="dom-dz">{{topicTaskContentData.praiseCount|numThousand}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "themeMy",
  props: {
    topicTaskContentData: {
      type: Object,
      default () {
				return {}
			}
    }
  },
  components: {},
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
    toVideo(data,num){
      data.pageNo = 1
      console.log(data,num)
      this.$emit('toVideo',data,num)
    }
  }
};
</script>

<style lang="scss" scoped>
.themeMy{
  img{
    max-width: 100%;
  }
  .tab-lt{
    margin-top: 20px;
    .imt{
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      line-height: 0;
      background:#f8f8f7 url("../../../assets/images/qinzi/icon_imgnone.png") no-repeat center;
      background-size: 114px;
      min-height: 200px;
      max-height: 460px;
      .icon-video{
        width: 32px;
        height: 32px;
        background: url("../../../assets/images/qinzi/icon_sp.png") no-repeat left bottom;
        background-size: 100%;
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }
    .text{
      font-size: 28px;
      color: #1C1C1C;
      line-height: 40px;
      margin: 16px 0 10px;
      text-align: justify;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: bold;
      word-break:break-all;
    }
    .dom{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24px;
      line-height: 33px;
      .dom-imt{
        display: flex;
        display: -webkit-flex;
        align-items: center;
        color: #666666;
        overflow: hidden;
        img{
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 8px;
        }
        .studentName{
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 140px;
        }
      }
      .dom-dz{
        background:url("../../../assets/images/qinzi/icon_support.png") no-repeat left center;
        background-size: 36px;
        padding-left: 36px;
      }
      .dom-dz.on{
        background:url("../../../assets/images/qinzi/icon_support.gif") no-repeat left center;
        background-size: 36px;
      }
    }
  }
}
</style>
