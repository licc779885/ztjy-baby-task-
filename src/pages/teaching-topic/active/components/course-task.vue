<template>
  <div>
    <div class="active-course">
        <div class="course-con">
            <img :src="courseTaskInfo.cover+'?imageView2/2/w/150'" alt="">
            <div>{{courseTaskInfo.title}}</div>
        </div>
        <div class="course-detail">
            <div class="course-detail-txt" :class="moreFlag ? 'course-detail-spread' : ''" v-html='courseTaskInfo.content'></div>
        </div>
        <div class="course-btn" :class="moreFlag ? 'course-spread' : 'course-retract'" @click="searchMoreInfo()">{{moreFlag ? '查看全文' : '收起'}}<i></i></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'course-task',
  props: {
    courseTaskInfo: {
      type: Object,
      default: {}
    },
    moreFlag: {
        type: Boolean,
        default: false
    }
  },
  methods: {
      searchMoreInfo () {
          this.$emit('change', this.moreFlag)
      }
  }
}
</script>
<style lang="scss" scoped>
.active-course{
    box-shadow: 0 0 16px 0 rgba(144,144,144,0.20);
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    margin-top: 40px;
    width: 630px;
    .course-con{
        display: flex;
        flex-direction: row;
        // justify-content: center;
        align-items: center;
        margin: 30px;
        img{
            width: 100px;
            height: 100px;
            background: url('../../../../assets/images/teaching-topic/photo.png');
            background-size: 100px 100px;
            border-radius: 16px;
        }
        div{
            margin-left: 16px;
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            display:-webkit-box; 
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            font-size: 32px;
            color: #1C1C1C;
            line-height: 48px;
        }
    }
    .course-detail{
        background: #F9F9F9;
        font-size: 28px;
        color: #1C1C1C;
        line-height: 42px;
        border-top: 1px  solid #ddd;
        border-bottom: 1px solid #ddd;
        .course-detail-txt{
            margin: 35px 30px 30px;
            word-break: break-all;
            /deep/img{
                width: 100%;
                margin-bottom: 20px;
            }
        }
        .course-detail-spread {
            overflow: hidden;
            max-height: 80px;
            text-overflow:ellipsis;
            display:-webkit-box; 
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
        }
    }
    .course-btn{
        height: 80px;
        font-size: 32px;
        color: #00AAFF;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        i{
            margin-left: 8px;
            width: 26px;
            height: 14px;
            background: url('../../../../assets/images/teaching-topic/icon-retract.png');
            background-size: 26px 14px;
        }
    }
    .course-spread i{
        background: url('../../../../assets/images/teaching-topic/icon-spread.png');
        background-size: 26px 14px;
    }
    .course-retract i{
        background: url('../../../../assets/images/teaching-topic/icon-retract.png');
        background-size: 26px 14px;
    }
}
</style>