<template>
  <div class="swiper-box" v-if="visible">
      <div class="close-btn" @click="closeSlider"></div>
      <van-swipe :initial-swipe='current' @change="onChange">
        <van-swipe-item v-for="(item, index) in dataSouce" :key='index' @click="closeSlider"><img :src="item.imageUrl" alt=""></van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{ current + 1 }}/{{dataSouce.length}}
          </div>
        </template>
      </van-swipe>
  </div>
</template>
<script>
import Vue from 'vue'
import { Swipe, SwipeItem } from 'vant'
Vue.use(Swipe)
Vue.use(SwipeItem)
export default {
  name: 'preview-image-full-screen',
  props: {
    index: {// 初始化图片的索引
      type: Number,
      default () {
        return 0
      }
    },
    dataSouce: {// 所有图片的集合
      type: Array,
      default: []
    }
  },
  data () {
    return {
      visible: this.status,
      current: 0
    }
  },
  mounted () {
    this.current = this.index
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    closeSlider () {
      this.visible = false
    },
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    },
    showIndex (index) {
      this.current = index
      this.show()
    }
  }
}
</script>
<style lang="scss" scoped>
.swiper-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 1);
  z-index: 999;
}
/deep/ .van-swipe__track {
    height: 95%;
    position: absolute;
    bottom: 0px;
}

.van-swipe {
  width: 100%;
  height: 100%;
}
 /deep/.custom-indicator {
  position: absolute;
  left: 50%;
  top: 10px;
  z-index: 99;
  padding: 2px 5px;
  font-size: 32px;
  color: #fff;
  margin-left: -32px;
  background: #111;
}
/deep/.van-swipe-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/deep/.van-swipe-item img{
  max-width: 100%;
  max-height: 100%;
}
.close-btn {
  background: url('~@/assets/images/teaching-topic/close-white@2x.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 1000;
  color: #fff;
  top: 20px;
  left: 30px;
}
</style>