export default [
  {
    path: '/teaching-topic/active/list',
    name: 'teacherTopicActiveList',
    meta: {
      title: ''
    },
    component: (resolve) => require(['@/pages/teaching-topic/active/list'], resolve)
  },
  {
    path: '/teaching-topic/active/detail',
    name: 'teacherTopicActiveDetail',
    meta: {
      title: '课程详情'
    },
    component: (resolve) => require(['@/pages/teaching-topic/active/courseDetail'], resolve)
  },
  {
    path: '/teaching-topic/active/changeTask',
    name: 'teacherTopicActiveTask',
    meta: {
      title: '亲子任务'
    },
    component: (resolve) => require(['@/pages/teaching-topic/active/changeTask'], resolve)
  },
  {
    path: '/teaching-topic/active/changeCourse',
    name: 'teacherTopicActiveCourse',
    meta: {
      title: '课程'
    },
    component: (resolve) => require(['@/pages/teaching-topic/active/changeCourse'], resolve)
  },
  {
    path: '/teaching-topic/active/summary',
    name: 'teacherTopicActiveSummary',
    meta: {
      title: '活动总结'
    },
    component: (resolve) => require(['@/pages/teaching-topic/active/activeSummary'], resolve)
  },
  {
    path: '/teaching-topic/plan-course',
    name: 'teacherIngPlanCourse',
    meta: {
      title: '课程安排'
    },
    component: (resolve) => require(['@/pages/teaching-topic/plan-course'], resolve)
  }
]
