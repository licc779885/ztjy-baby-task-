<template>
  <div class="themeList">
    <div class="tab-lt" v-for="(item,index) in themeDataEvenArr" :key="index" @click="toVideo(item)">
        <!--  广告-->
        <template v-if="item.advertId">
          <div ref="baby-task-ad-show" :parm="JSON.stringify({index: item.listAnAdIndex, ad_id: item.advertId, showApi: handleShowApi('view', item)})">
            <div class="imt"><img :src="item.content.images[0]" alt="" onerror="this.style.display='none'"> <div class="classmate" v-if='item.classmate'>同班</div> </div>
            <div class="text">{{item.content.content}}</div>
            <div class="dom">
              <div class="dom-imt">
                <template v-if="item.content && item.content.icon">
                  <img :src="item.content.icon[0]">
                </template>
                <span class="studentName" style="max-width: 80px;">{{item.content.adName}}</span>
              </div>
              <!-- isShowAdvert: 0否 1是-->
              <div class="advert-tag" v-if="item.isShowAdvert===1">广告</div>
            </div>
          </div>
        </template>
        <!--  内容-->
        <template v-else>
          <div class="imt"><img :src="item.cover" alt="" onerror="this.style.display='none'"><i class="icon-video"></i> <div class="classmate" v-if='item.classmate'>同班</div></div>
          <div class="text">{{item.content}}</div>
          <div class="dom" v-if="item.studentInfo">
            <div class="dom-imt">
              <template v-if="item.studentInfo.userPic">
                <img :src="item.studentInfo.userPic">
              </template>
              <template v-else>
                <img v-if="item.studentInfo.sex==0" :src="require('@/assets/images/avatar/boy.png')" />
                <img v-if="item.studentInfo.sex==1" :src="require('@/assets/images/avatar/girl.png')" />
              </template>
              <span v-if="item.studentInfo" class="studentName">{{item.studentInfo.trueName}}</span>
            </div>
            <div class="dom-dz">{{item.praiseCount|numThousand}}</div>
          </div>
        </template>
      </div>
  </div>
</template>

<script>
import handleReport from '@/mixins/handleReport'
import { onStatisticEvent } from '@/utils/client'
import request from '@/utils/request'
export default {
  name: "themeList",
  mixins: [handleReport],
  props: {
		themeDataEvenArr: {
			type: Array,
			default () {
        return []
      }
    }
	},
  components: {
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
  mounted () {
    this.handleElementInView([{
      ref: 'baby-task-ad-show',
      showType: ['little'], //  little：露出一点，half：露出一半
      callBack: (res)=>{
        console.log('埋点曝光', res)
        request.get(res.parm.showApi, {}, { showToast: false }) // showToast: 是否显示提示
        onStatisticEvent(3, {
          status: '5',
          space_id: 1015,
          ad_id: res.parm.ad_id,
          ad_location: res.parm.index
        })
      }
    }])
	},
  watch: {
    'themeDataEvenArr':{
      handler(){
        this.$nextTick(()=>{
          this.handleElement() // 处理dom的显示埋点
        })
      }
    }
  },
  methods: {
    // 获取埋点请求的api
    handleShowApi (type, item) {
      try {
        return item.interact.thirdInteract[type][0] // type：view、click
      }
      catch (e) {
        return ''
      }
    },
    toVideo (data) {
      console.log('点击', data, data.listIndex)
      let clickApi = this.handleShowApi('click', data)
      request.get(clickApi, {}, { showToast: false }) // 请求自有系统埋点， showToast: 是否显示提示
      this.$emit('toVideo',data, data.listIndex) // data.listIndex：内容索引(不包括广告)  , data.listAnAdIndex：真实索引（包括广告）
    }
  }
};
</script>

<style lang="scss" scoped>
.themeList{
  img{
    max-width: 100%;
  }
  font-size: 28px;
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
      .classmate{
        width: 64px;
        height: 36px;
        background: #FFD100;
        border-radius: 8px;
        font-size: 22px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 20px;
        bottom: 20px;
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
      .advert-tag{
        border: 2px solid #DDD;
        color: #DDD;
        border-radius: 8px;
        padding: 0 4px;
        font-size: 20px;
      }
    }
  }
}
</style>
