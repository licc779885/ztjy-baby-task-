// 处理显示埋点   -- mixin方法

// // DEMO
// this.handleElementInView([{
//   ref: 'baby-task-ad-show',
//   showType: ['little', 'half'], //  little：露出一点，half：露出一半
//   callBack: (res)=>{
//     console.log('埋点曝光', res.showType)
//     if (res.showType === 'little'){ // 露出一点
//       onStatisticEvent(3, {
//         status: '5',
//         space_id: 1015,
//         ad_id: res.parm.ad_id,
//         ad_location: res.parm.index
//       })
//     } else if (res.showType === 'half'){ // 露出一半 > 50%
//
//     }
//   }
// }])
export default {
  methods: {
    // 处理dom的显示埋点 -- 节流
    handleElementThrottle () {
      // console.log(111)
      return this.throttle(this.handleElement, 300)
    },
    // 处理dom的显示埋点 -- 监听scroll
    handleElementInView (arrConfig) {
      if (arrConfig && arrConfig.length > 0) {
        this.arrConfig = arrConfig
        window.removeEventListener('scroll', this.handleElementThrottle)
        window.addEventListener('scroll', this.handleElementThrottle) // 添加滚动监听
        this.handleElement()
      }
    },
    throttle(fn, timeout, context){
      //如果上次没调用过，直接调用
      if(!fn.lastExec){
        fn.lastExec = Date.now();
        fn.call(context);
      }else{
        //如果调用过 --- 如果这次的调用时间超过了设置的设定好的timeout
        var remaining = Date.now() - fn.lastExec;
        if(remaining > timeout){
          //新调用
          fn.lastExec = Date.now();
          fn.call(context);
        }
      };
    },
    // 处理dom的显示埋点 -- 处理
    handleElement () {
      if (this.arrConfig) { // 数组
        this.arrConfig.forEach(item => {
          const dom = item.ref && this.$refs[item.ref]
          if (dom) { // 能取到该dom
            if (Object.prototype.toString.call(dom) === '[object Array]') { // 数组形式
              dom.forEach((domChil, domIndex) => {
                isDomView.call(this, domChil, item, domIndex)
              })
            } else { // 字符串
              isDomView.call(this, dom, item)
            }
          }
        })
      }

      // 在可是区域内则触发埋点 -- 只一次
      function isDomView (dom, item, domIndex) {
        item.showType = item.showType || 'little' // 默认冒出一点即回调
        if (Object.prototype.toString.call(item.showType) === '[object Array]') { // 数组形式
          item.showType.forEach(type =>{
            isView.call(this, type)
          })
        } else { // 字符串
          isView.call(this, item.showType)
        }
        function isView(showType) {
          if (dom.attributes[showType] !== 1 && this.isElementInViewport(dom, item, showType)) { // 只有第一次才触发
            dom.attributes[showType] = 1
            const parm = JSON.parse(dom.attributes.parm ? dom.attributes.parm.value : '{}') // 埋点的parm里面的参数
            const callParm = {
              ref: item.ref,
              showType: showType,
              parm: parm
            }
            item.callBack && item.callBack(callParm)
          }
        }
      }
    },
    // 获取元素是否在可视区域
    isElementInViewport (el, item, showType) {
      const rect = el.getBoundingClientRect()
      if(showType == 'little') { // 漏出一点
        return (
          rect.top >= -rect.height + 5 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 5
        )
      } else if(showType == 'half') { // 漏出一半
        return (
          rect.top >= -(rect.height / 2) + 5 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 5 - (rect.height / 2)
        )
      } else if (showType === 'swiper') { // 轮播模式的数据
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
        )
      }
    }
  }
}
