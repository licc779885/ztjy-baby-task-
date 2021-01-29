/**
 * 全局唯一标识符
 * @returns {string}
 */
export function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const rand = Math.random() * 16 | 0
    const value = c === 'x' ? rand : (rand & 0x3 | 0x8)
    return value.toString(16)
  })
}

/**
 * 防抖函数，多次执行变为最后一次执行
 * 应用场景：
 * 实时搜索（keyup）
 * 拖拽（mousemove）
 * @param fun 函数
 * @param delay 延迟的时间，默认100毫秒
 */
export function debounce (fun, delay = 100) {
  return function (args) {
    let that = this
    let _args = args
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}
// 判断是那个端
export function browserInfo () {
  let userAgent = navigator.userAgent
  return {
    isIos: /(iPhone|iPad|iPod|iOS)/i.test(userAgent),
    isAndroid: /(Android|Linux)/i.test(userAgent),
    isWeiXin: /MicroMessenger/i.test(userAgent)
  }
}

export function LoadingDebounce (fun, delay = 100, loading = true) {
  return function (args) {
    let that = this
    let _args = args
    clearTimeout(fun.id)
    if (!loading) return
    fun.id = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}

/**
 * 多次执行，变为每隔一段时间执行
 * 应用场景：
 * 页面滚动（scroll）
 * 抢购疯狂点击 (mousedown)
 * @param fun 函数
 * @param delay 延迟的时间，毫秒
 */
export function throttle (fun, delay = 50) {
  let last, deferTimer
  return function (args) {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    } else {
      last = now
      fun.apply(that, _args)
    }
  }
}
