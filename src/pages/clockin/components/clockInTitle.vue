<template>
  <div class="theme-title" v-if="namespace" @click="toBack">
    <i class="task-back"></i>
  </div>
</template>

<script>
import { namespace, jsToClient } from '@/utils/client'
export default {
  name: "clockInTitle",
  data() {
    return {
      namespace: namespace,
    };
  },
  created() {
    
  },
  mounted () {

	},
  methods: {
    toBack(){
      this.$emit('toBack')
    }
  }
};
</script>

<style lang="scss" scoped>
.theme-title{
  height: 85px;
  width: 85px;
  position: fixed;
  left: 8px;
  top: 0;
  right: 0;
  z-index: 105;
  display: flex;
  align-items: center;
  justify-content: center;
  .task-back{
    width: 48px;
    height: 48px;
    background: url("../../../assets/images/qinzi/icon_back_black.png") no-repeat center;
    background-size: 100%;
  }
}
</style>
