<template>
  <div class="page-notfound">
    <img class="icon-error" src="../assets/images/icon_error@2x.png"/>
    <div class="sub-tit">页面不见啦，点击刷新重试下</div>
    <div class="btn-home" @click="goHome">回到首页</div>
  </div>
</template>

<script>
export default {
  name: 'notFound',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    goHome () {
      // 返回上一页
      // this.$router.go(-1)
      // 字符串
      this.$router.replace('/')
      // 对象
      // this.$router.push({ path: '/home/first' })
      // 命名的路由
      // this.$router.push({ name: 'home', params: { userId: 1 }})
    }
  }
}
</script>

<style lang="scss">
  .page-notfound {
    background-color: #fff;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .icon-error {
    width: 334px;
    height: 194px;
    margin-top: 280px;
  }
  .sub-tit {
    font-family: PingFangSC-Regular;
    font-size: 32px;
    color: #333333;
    margin-bottom: 60px;
  }
  .btn-home {
    width: 380px;
    height: 80px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    background-color: #00AAFF;
    color: #fff;
    font-size: 32px;
  }
</style>
