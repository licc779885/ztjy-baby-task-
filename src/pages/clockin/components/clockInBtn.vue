<template>
  <div class="clockin-btn">
    <div class="btn-text" @click="btnclick">邀请点赞</div>
  </div>
</template>

<script>

export default {
  name: "clockInBtn",
  data() {
    return {

    };
  },
  created() {
  },
  mounted () {

	},
  methods: {
    btnclick(){
      this.$emit('btnclick')
    }
  }
};
</script>

<style lang="scss" scoped>
.clockin-btn{
  height: 88px;
  line-height: 88px;
  border-radius: 44px;
  text-align: center;
  font-size: 32px;
}
</style>
