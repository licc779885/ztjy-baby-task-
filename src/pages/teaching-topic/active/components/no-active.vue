<template>
  <div class="no-active">
      <img src='../../../../assets/images/teaching-topic/no-active.png' alt="">
      <p>{{txt}}</p>
  </div>
</template>
<script>
export default {
  name: 'no-active',
  props: {
    txt: {
      type: String,
      default: '活动走丢了'
    }
  }
}
</script>
<style lang="scss" scoped>
.no-active{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
        width: 376px;
        height: 296px;
    }
    p{
        font-size: 32px;
        color: #333333;
        margin-top: 48px;
    }
}
</style>