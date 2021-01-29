<template>
  <div class="pageNone">
    <div class="">
      <div class="pageNone-img">
        <img v-if="namespace == 'gardener'" src="../../../assets/images/qinzi/icon_none1.png" />
        <img v-else src="../../../assets/images/qinzi/icon_none.png" />
      </div>
      <div class="pageNone-text">
        <template v-if="noneText==0">
          <div class="partIn-none">
            <div>没有任何打卡任务呢~</div>
            <div class="dom">快记录下孩子有趣的小日常吧</div>
          </div>
        </template>
        <template v-if="noneText==1">
          <div>唔，暂未上传作品~</div>
        </template>
        <template v-if="noneText==2">
          <div>暂无数据~</div>
        </template>
        <template v-if="noneText==3">
          <div>唔，还没有内容哦~</div>
        </template>
        <template v-if="noneText==4">
          <div>任务已被删除或下架~</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
export default {
  name: "clockInNone",
  props:{
    noneText:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      namespace: namespace
    };
  },
  created() {
  },
  mounted () {

	},
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.pageNone{
    margin-top: 240px;
		text-align: center;
		font-size: 32px;
    line-height: 44px;
    color: #1C1C1C;
		display: flex;
		align-items: center;
    justify-content:center;
    .pageNone-img img{
      width: 400px;
    }
    .partIn-none{
      .dom{
        font-size: 28px;
        opacity: 0.5;
        color: #1F1F1F;
        margin-top: 16px;
      }
    }
}
</style>
