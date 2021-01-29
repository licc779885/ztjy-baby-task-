<template>
  <div>
    <div class="no-data">
        <img src='../../../../assets/images/teaching-topic/no-data.png' alt="">
        <p>{{txt}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'no-data',
  props: {
    txt: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
        width: 156px;
        height: 140px;
        margin-top: 17px;
    }
    p{
        font-size: 28px;
        color: #818D9D;
        margin-top: 27px;
    }
}
</style>