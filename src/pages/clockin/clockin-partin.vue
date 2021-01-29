<template>
  <div class="clockin-partin">
    <van-tabs v-model="active" @click="onClick">
      <van-tab title="进行中">
        <div class="partin-on" v-if="partInData.length>0">
          <van-list
            v-model="loading"
            :finished="finished"
            offset="50"
            finished-text="没有更多数据~"
            @load="onLoad"
          >
            <partInList v-if="partInDataArr.length" :partInDataArr="partInDataArr" :indexType="indexType"></partInList>
				  </van-list>
        </div>
        <clockInNone v-show="isnone"></clockInNone>
      </van-tab>
      <van-tab title="已结束">
        <div class="partin-end" v-if="partInData.length>0">
          <van-list
            v-model="loading"
            :finished="finished"
            offset="50"
            finished-text="没有更多数据~"
            @load="onLoad"
          >
            <partInList v-if="partInDataArr.length" :partInDataArr="partInDataArr" :indexType="indexType"></partInList>
				  </van-list>
        </div>
        <clockInNone v-show="isnone"></clockInNone>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast } from 'vant'
import * as $service from "@/services"
import { getUrlParam, versionCompare } from 'szyutils'
import { namespace, jsToClient, clientToJs, onStatisticEvent, getUserInfo } from '@/utils/client'
import partInList from './components/partInList'
import clockInNone from './components/clockInNone'
export default {
  name: "clockInPartIn",
  computed: {
    partInDataArr () {
      return this.partInData
    },
    indexType () {
      return this.indexVal
    }
  },
  components: {
    partInList,
    clockInNone
  },
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      statusVal: 1,
      indexVal: 0,
      isnone: false,
      studentId: '',
      page: 1,
      pageSize: 20,
      partInData: [],
      namespace: namespace
    };
  },
  created() {
    if(namespace){
      // 设置界面恢复展示时自动刷新
      // clientToJs('autoRefreshCallback', ()=>{
      //   jsToClient('updateBarStatus', {
      //     type:'topBar',
      //     visible: true
      //   })
      // })
      // // 
      // jsToClient('jumpTo', {
      //   action: 'autoRefresh',
      //   data: {
      //     'needRefresh': true
      //   }
      // })
      // 
      getUserInfo(this.$store).then(userInfo => {
        this.studentId = userInfo.student_uid
        this.getPartInList()
      })
    }else{
        this.studentId = getUrlParam('studentId')
        this.getPartInList()
    }
    
    // 页面埋点
    onStatisticEvent(1, {page_category: 2, page: 'my_participate'})
  },
  mounted () {
    
	},
  methods: {
    onClick(index){
      window.scrollTo(0,0)
      this.indexVal = index
      this.statusVal = index+1
      this.page = 1
      this.loading = true
      this.finished = false
      this.isnone = false
      this.partInData = []
      if(this.loading){
        this.onLoad()
      }
      // this.getPartInList()
    },
    onLoad(){
      this.getPartInList()
      this.isnone = false
    },
    // 获取我的参与数据
    getPartInList () {
      if(this.page==1){
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:0
        })
      }
      const params = {
        studentId: this.studentId,
        status: this.statusVal,
        page: this.page,
        size: this.pageSize
      }
      this.page++
      $service.getPartInList(params).then(res => {
        console.log(res)
        if(res.code && res.code!=10000){
          console.log('数据错误')
        }else{
          Toast.clear()
        }
        if(res.result){
          this.partInData = this.partInData.concat(res.result)
          this.loading = false
          if(this.partInData.length>0){
            this.isnone = false
            if(this.partInData.length >= res.totalCount){
              this.finished = true
            }
          }else{
            this.isnone = true
            this.finished = true
          }
        }else{
          this.isnone = true
          this.finished = true
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.clockin-partin{
  padding-top: 77px;
  font-size: 28px;
  /deep/ .van-tabs--line .van-tabs__wrap{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 3;
    height: 76px;
    border-bottom: 1px solid #eee;
    padding: 0 90px;
  }
  /deep/ .van-tab__text--ellipsis{
    margin-top: -10px;
  }
  /deep/ .van-tabs__nav--line{
    padding-bottom: 0;
    height: 74px;
  }
  /deep/ .van-tab{
		color: #1C1C1C;
    font-size: 30px;
    height: 100%;
  }
  /deep/ .van-tab--active{
		font-size: 32px;
    font-weight: bold;
    background: url("../../assets/images/qinzi/icon_line.png") no-repeat center 35px;
    background-size: 76px;
  }
  /deep/ .van-tabs__line{
		width: 0;
		height: 0;
  }
}
</style>
