const OBJECT_PROTOTYPE = Object.prototype
const ARRAY_PROTOTYPE = Array.prototype
const HTML_ENTITIES = [
  '&', '&amp;',
  '<', '&lt;',
  '>', '&gt;',
  ' ', '&nbsp;',
  '\'', '&#39;',
  '"', '&quot;'
]

/**
 * 深拷贝
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

/** 空操作 */
export function noop () { }
/** 判断是否是字符串对象 */
export const isString = _checkType('string')
/** 判断是否是函数对象 */
export const isFunction = _checkType('function')
/** 判断是否是数组对象 */
export const isArray = Array.isArray || function (obj) {
  return obj instanceof Array
}
/** 判断是否是Object对象 */
export const isObject = _checkType('object')

/**
 * 判断是否是纯Object对象（判断条件相对isObject而言要更严格）
 * @param obj 被判断的对象
 * @returns {boolean}
 */
export function isPlainObject (obj) {
  const ctor = obj.constructor
  const prot = ctor.prototype
  return isObject(obj) && typeof ctor === 'function' &&
    isObject(prot) && prot.hasOwnProperty('isPrototypeOf')
}

/**
 * 判断是否是数值对象
 * @param obj 被判断的对象
 * @returns {boolean}
 */
export function isNumber (obj) {
  return getType(obj) === 'number' && !isNaN(obj)
}

/**
 * 判断是否是Promise对象
 * @param obj 被判断的对象
 * @returns {boolean}
 */
export function isPromise (obj) {
  return !!obj && (isObject(obj) || isFunction(obj)) && isFunction(obj.then)
}

/**
 * 判断是否是HTML节点
 * @param node 被判断的对象
 * @returns {boolean|ActiveX.IXMLDOMNodeType|number|string} 如果是HTML节点，返回非false值
 */
export function isHTMLElement (node) {
  return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
}

/**
 * 判断变量是否已经定义
 * @param value 被判断的变量
 * @returns {boolean}
 */
export function isDefined (value) {
  return typeof value !== 'undefined'
}

/**
 * 将多个对象合并进目标对象中，如果最后一个参数的类型为布尔型，则用于指定是否使用后面的对象的
 * 字段值覆盖目标对象的同名字段。
 * @param target 目标对象
 * @returns {Object}
 */
export function mixin (target) {
  const args = arguments
  let len = args.length
  let i = 1
  let overwrite, source

  target = target || {}

  if (len > 1) {
    if (typeof args[len - 1] === 'boolean') {
      overwrite = args[--len]
    }

    while (i < len) {
      (source = args[i++]) && each(source, (value, name) => {
        if (isDefined(value) && (overwrite || !(name in target))) {
          target[name] = value
        }
      })
    }
  }

  return target
}

/**
 * 获取变量的类型
 * @param obj 查询类型的变量
 * @returns {string}
 */
export function getType (obj) {
  return OBJECT_PROTOTYPE.toString.call(obj).match(/\s(\w+)/)[1].toLowerCase()
}

/**
 * 生成 [min, max) 范围的随机整数
 * @param min 随机数的下限
 * @param max 随机数的上限，若改参数未指定，则生成 [0, min) 范围的随机整数
 * @returns {number}
 */
export function rand (min, max) {
  if (max === undefined) {
    max = min
    min = 0
  }
  return min + (Math.random() * (max - min)) | 0
}

/**
 * 类似Array.prototype.forEach，但对Object有效
 * @param obj 被遍历的对象
 * @param fn 遍历函数
 * @param context 遍历函数上下文对象
 */
export function each (obj, fn, context) {
  if (obj) {
    if (isArray(obj)) {
      ARRAY_PROTOTYPE.forEach.call(obj, fn, context | obj)
    } else {
      Object.keys(obj).forEach(key => {
        fn.call(context | obj, obj[key], key, obj)
      })
    }
  }
}

/**
 * 编码HTML特殊字符串
 * @param html 需要编码的HTML字符串
 * @returns {string}
 */
export function htmlEncode (html) {
  return html.replace(/[&<>'"]/g, function (matched) {
    return HTML_ENTITIES[HTML_ENTITIES.indexOf(matched) + 1]
  })
}

/**
 * 解码HTML特殊字符串
 * @param html 需要解码的HTML字符串
 * @returns {string}
 */
export function htmlDecode (html) {
  return html.replace(/&(?:amp|lt|gt|nbsp|#39|quot);/g, function (matched) {
    return HTML_ENTITIES[HTML_ENTITIES.indexOf(matched) - 1]
  })
}

function _checkType (type) {
  return function (obj) {
    return getType(obj) === type
  }
}
