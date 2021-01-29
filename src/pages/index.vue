<template>
  <div class="welcome" v-if="runtime === 'development'">
    <router-link class="link" :to="{name:'commonOpenApp'}">掌通家园</router-link>
    <router-link class="link" :to="{name:'commonUpdateApp'}">版本升级</router-link>
  </div>
  <div class="welcome" v-else>welcome</div>
</template>

<script>
import store from '@/store/index';
const RUNTIME_ENV = process.env.VUE_APP_RUNTIME_ENV // development 才出现
export default {
  name: 'welcome',
  data() {
    return {
      runtime: RUNTIME_ENV
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss">
  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 30px;
    line-height: 2;
  }
</style>
