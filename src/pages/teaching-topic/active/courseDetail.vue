<template>
<div class="contain">
    <div class="course-datail" v-html="detail"></div>
</div>
</template>
<script>
import { getCourseDetail } from '@/services/index'
import { getUrlParam } from 'szyutils'
export default {
  name: 'courseDetail',
  data () {
    return {
      detail: ''
    }
  },
  created () {
    this.getDetail()
    this.pv({
      page: 'course_details',
      page_category: 3,
      parm: getUrlParam('teachingActivityId')
    })
  },
  methods: {
    getDetail () {
      getCourseDetail({courseId: getUrlParam('courseId')}).then(res => {
        if (res.code && res.code !== 10000) {
          Toast(res.message)
          return
        }
        this.detail = res.content
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.contain{
  width: 100%;
  height: 100%;
  background: rgba(242,243,245,0.62);
  padding: 1px;
  .course-datail {
    flex: 1;
    padding: 40px 10px 20px;
    font-size: 28px;
    color: #818D9D;
    word-wrap:break-word;
    position: relative;
    /deep/ img {
      width: 100%;
    }
    /deep/ p {
      max-height: none;
    }
  }
}
</style>