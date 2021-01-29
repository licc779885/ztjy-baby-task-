<template>
  <div class="spinner" :class="{mask: mask}">
    <div class="circle ignore">
      <i v-for="n in 12" :key="n"></i>
    </div>
    <p class="desc">{{desc}}</p>
  </div>
</template>

<script>
  export default {
    name: 'x-loading',
    props: {
      // 描述文本
      desc: {
        type: String,
        default: '加载中...'
      },
      mask: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style lang="scss">
// loading
$current-color: #c9c9c9;
.spinner {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  flex-direction: column;
  left: 0;
  top: 0;
  font-size: 0;
  &.mask {
    background-color: rgba(0,0,0,.6);
  }
  .circle {
    position: relative;
    display: inline-block;
    margin: 0 auto;
    width: 60px;
    max-width: 100%;
    height: 60px;
    max-height: 100%;
    vertical-align: middle;
    animation: x-rotate 0.8s linear infinite;
    animation-timing-function: steps(12);
    i {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      &::before {
        display: block;
        width: 2px;
        height: 25%;
        margin: 0 auto;
        background-color: $current-color;
        border-radius: 40%;
        content: ' ';
      }

      @for $i from 0 through 12
      {
        &:nth-of-type(#{$i}) {
          transform: rotate($i * 30deg);
          opacity: 1 - (0.75 / 12) * ($i - 1);
        }
      }
    }
  }
  .desc {
    color: $current-color;
    justify-content:center;
    display: flex;
    font-size: 28px;
    padding-top: 10px;
  }
}

@keyframes x-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
