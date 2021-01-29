<template>
  <div class="praiseRule">
      <van-overlay :show="tancType" id="honorRoll-tanc" :lock-scroll=false>
			<div class="tanContent">
				<div class="tanText">
					<div class="text-title" v-html="tancTitle"></div>
					<div class="text-info" v-html="tancContent"></div>
					<div class="text-btn" @click="closeTanc">知道了</div>
				</div>
				<div class="tanClose" @click="closeTanc"></div>
			</div>
		</van-overlay>
  </div>
</template>

<script>
import * as $service from "@/services"
export default {
  name: "praiseRule",
  props: {
		tancType: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
  data() {
    return {
      tancTitle: '',
      tancContent: ''
    };
  },
  created() {
    this.getDocument()  //文案测试
  },
  mounted () {

	},
  methods: {
    closeTanc(){
      this.$emit('closeTanc')
    },
    // 获取文案
    getDocument () {
      const params = {
        'schoolId':'',
				'positionKeys': 'QZDK-A0016,QZDK-A0017'
			}
      $service.getDocument(params).then(res => {
        console.log(res)
        this.tancTitle = res['QZDK-A0016']
        this.tancContent = res['QZDK-A0017']
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.praiseRule{
  font-size: 28px;
  position: relative;
  /deep/ .van-overlay{
    z-index: 100;
  }
  #honorRoll-tanc{
    .tanContent{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        .tanText{
          width: 550px;
          background: #fff;
          padding: 80px 40px 70px;
          box-sizing: border-box;
          border-radius: 30px;
          .text-title{
            font-size: 36px;
            color: #333333;
            line-height: 50px;
            text-align: center;
          }
          .text-info{
            font-size: 28px;
            color: #818D9D;
            line-height: 44px;
            margin: 30px 0 50px 0;
            text-align: justify;
            max-height: 530px;
            overflow-x: hidden;
            overflow-y: scroll;
          }
          .text-btn{
            width: 100%;
            height: 80px;
            line-height: 85px;
            background-image: linear-gradient(129deg, #FFE061 0%, #FFC929 100%, #FFC929 100%);
            border-radius: 80px;
            font-size: 30px;
            color: #fff;
            text-align: center;
          }
        }
        .tanClose{
          width: 50px;
          height: 50px;
          background: url("../../../assets/images/qinzi/icon_close.png") no-repeat left bottom;
          background-size: 100%;
          margin-top: 42px;
        }
    }
  }
  /deep/ .van-cell::after{
		border-bottom:none
  }
  /deep/ .van-overlay{
		background-color: rgba(0,0,0,.6);
	}
}
</style>
